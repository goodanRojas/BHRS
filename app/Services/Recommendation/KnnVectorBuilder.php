<?php

namespace App\Services\Recommendation;


use App\Models\Building;
use App\Services\Recommendation\FeatureMapService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;


class KnnVectorBuilder
{
     protected FeatureMapService $mapService;
    protected array $featureIndex;
    protected int $featureCount;

    // numeric feature keys appended after the binary/weighted features
    protected array $numericKeys = ['price_norm', 'rating_norm', 'distance_norm'];

    public function __construct()
    {
        $this->mapService = new FeatureMapService();
        $this->featureIndex = $this->mapService->buildFeatureIndex();
        $this->featureCount = count($this->featureIndex);
    }

    public function emptyVector(): array
    {
        return array_fill(0, $this->featureCount + count($this->numericKeys), 0.0);
    }

    // Build user vector from onboarding: binary 1/0 for selected features
    public function buildUserVector(int $userId): array
    {
        $map = $this->featureIndex;
        $vec = $this->emptyVector();

        $onboarding = \App\Models\UserOnBoarding::where('user_id', $userId)->first();

        if (! $onboarding || ! is_array($onboarding->bed_preference)) {
            return $vec;
        }

        foreach ($onboarding->bed_preference as $raw) {
            $token = FeatureMapService::normalize((string)$raw);
            if (isset($map[$token])) {
                $vec[$map[$token]] = 1.0; // binary presence
            }
        }

        // numeric fields for user: prefer lower price? we'll encode price preference separately in ranking step
        // leave numeric slots at 0 (or set custom user desired price if you have)
        return $vec;
    }

    // Build building vector using weighted frequency across building, room, bed
    public function buildBuildingVector(Building $building, ?array $options = []): array
    {
        $map = $this->featureIndex;
        $vec = $this->emptyVector();

        // collect all features for building + rooms + beds
        $features = $building->features()->pluck('name')->map(fn($n) => FeatureMapService::normalize($n))->toArray();

        // rooms and beds (eager load recommended in caller to avoid N+1)
        $roomFeatures = $building->rooms->flatMap(fn($r) => $r->features->pluck('name')->map(fn($n) => FeatureMapService::normalize($n)));
        $bedFeatures = $building->rooms->flatMap(fn($r) => $r->beds->flatMap(fn($b) => $b->features->pluck('name')->map(fn($n) => FeatureMapService::normalize($n))));

        $all = array_merge($features, $roomFeatures->toArray(), $bedFeatures->toArray());

        $total = count($all) > 0 ? count($all) : 1;
        $freq = array_count_values($all);

        // Weighted score = frequency / total (makes values between 0 and 1)
        foreach ($freq as $token => $count) {
            if (isset($map[$token])) {
                $vec[$map[$token]] = $count / $total;
            }
        }

        // Numeric features: price, rating, distance -- need normalization across dataset
        // We'll compute normalized numeric values outside and inject via options: price_norm, rating_norm, distance_norm
        // options should contain these normalized numbers in [0,1]
        $offset = $this->featureCount;
        foreach ($this->numericKeys as $i => $k) {
            $vec[$offset + $i] = $options[$k] ?? 0.0;
        }

        return $vec;
    }
}