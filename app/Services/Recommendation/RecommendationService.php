<?php 

namespace App\Services\Recommendation;

use App\Models\Building;
use Illuminate\Support\Facades\Cache;
use App\Services\Recommendation\KnnVectorBuilder as VectorBuilder;
use App\Services\Recommendation\FeatureMapService;
use App\Services\Recommendation\SimilarityService;
class RecommendationService
{
    protected VectorBuilder $vectorBuilder;
    protected FeatureMapService $mapService;

    // tuning
    protected int $K = 10; // top K to return
    protected float $priceWeight = 0.2; // how much price influences final ranking
    protected float $featureWeight = 0.8; // features/rating/distance weight in similarity

    public function __construct()
    {
        $this->vectorBuilder = new VectorBuilder();
        $this->mapService = new FeatureMapService();
    }

    // Entry method
    public function recommendForUser(int $userId, ?array $userLocation = null): array
    {
        // user vector
        $userVector = $this->vectorBuilder->buildUserVector($userId);

        // load buildings with necessary relations to avoid N+1
        $buildings = Building::with([
            'features',
            'rooms.features',
            'rooms.beds.features',
            'rooms.beds.bookings' // optional
        ])->get();

        // Precompute numeric normalization ranges for price & rating & distance
        $priceList = []; $ratingList = []; $distanceList = [];
        foreach ($buildings as $b) {
            $priceList[] = $b->rooms->flatMap(fn($r) => $r->beds->pluck('price'))->min() ?? 0;
            $ratingList[] = $b->avg_rating ?? 0;
            if ($userLocation && isset($b->latitude, $b->longitude)) {
                $distanceList[] = $this->haversineDistance($userLocation['lat'], $userLocation['lng'], $b->latitude, $b->longitude);
            } else {
                $distanceList[] = null;
            }
        }

        // compute min/max while skipping nulls
        $priceMin = min($priceList); $priceMax = max($priceList);
        $ratingMin = min($ratingList); $ratingMax = max($ratingList);
        $distanceMin = null; $distanceMax = null;
        if ($userLocation) {
            $distances = array_filter($distanceList, fn($v) => $v !== null);
            $distanceMin = count($distances) ? min($distances) : 0;
            $distanceMax = count($distances) ? max($distances) : 1;
        }

        $scored = [];

        foreach ($buildings as $building) {
            // derive numeric normalized values
            // price: pick cheapest bed price from building as representative
            $prices = $building->rooms->flatMap(fn($r) => $r->beds->pluck('price'));
            $price = $prices->count() ? $prices->min() : $priceMin;
            $rating = $building->avg_rating ?? 0;

            $price_norm = $this->normalize($price, $priceMin, $priceMax, invert: true); // cheaper -> higher value
            $rating_norm = $this->normalize($rating, $ratingMin, $ratingMax);
            $distance_norm = 0.0;
            if ($userLocation && isset($building->latitude, $building->longitude)) {
                $d = $this->haversineDistance($userLocation['lat'], $userLocation['lng'], $building->latitude, $building->longitude);
                $distance_norm = $this->normalize($d, $distanceMin ?? 0, $distanceMax ?? 1, invert: true); // closer -> higher value
            }

            $options = [
                'price_norm' => $price_norm,
                'rating_norm' => $rating_norm,
                'distance_norm' => $distance_norm,
            ];

            $bVec = $this->vectorBuilder->buildBuildingVector($building, $options);

            $sim = SimilarityService::cosineSimilarity($userVector, $bVec);

            // optionally, incorporate price to prefer cheaper options (we already encoded price as numeric, but apply additional tie-break or multiplier)
            // final score: combine similarity and a price bias (since you wanted cheaper preferred)
            $finalScore = $sim * (1 - $this->priceWeight) + ($price_norm * $this->priceWeight);

            $scored[] = [
                'building' => $building,
                'vector' => $bVec,
                'similarity' => $sim,
                'final_score' => $finalScore,
            ];
        }

        // sort by final_score descending
        usort($scored, fn($a, $b) => $b['final_score'] <=> $a['final_score']);

        $top = array_slice($scored, 0, $this->K);

        // find best matching room & bed per building
        $results = [];
        foreach ($top as $item) {
            $building = $item['building'];
            $bestRoom = null; $bestRoomSim = -1; $bestBed = null; $bestBedSim = -1;

            // build vectors for rooms and beds similar to building vector but narrower (room-level)
            foreach ($building->rooms as $room) {
                // compile a temporary vector for room (you can reuse the VectorBuilder logic but here we do a quick approach)
                $roomFeatures = $room->features->pluck('name')->map(fn($n) => FeatureMapService::normalize($n))->toArray();
                $bedFeatures = $room->beds->flatMap(fn($b) => $b->features->pluck('name')->map(fn($n) => FeatureMapService::normalize($n)))->toArray();
                $all = array_merge($roomFeatures, $bedFeatures);
                $vecRoom = $this->vectorBuilder->emptyVector(); // note: make public if needed; otherwise replicate logic
                // frequency weighting
                $freq = array_count_values($all);
                $total = count($all) ?: 1;
                foreach ($freq as $token => $count) {
                    $map = $this->mapService->buildFeatureIndex();
                    if (isset($map[$token])) {
                        $vecRoom[$map[$token]] = $count / $total;
                    }
                }
                // numeric slots optional: put room price/rating as normalized relative to building dataset (skipped here for brevity)
                $simRoom = SimilarityService::cosineSimilarity($userVector, $vecRoom);
                if ($simRoom > $bestRoomSim) {
                    $bestRoomSim = $simRoom;
                    $bestRoom = $room;
                }

                // bed-level
                foreach ($room->beds as $bed) {
                    $bf = $bed->features->pluck('name')->map(fn($n) => FeatureMapService::normalize($n))->toArray();
                    $vecBed = $this->vectorBuilder->emptyVector();
                    $freqb = array_count_values($bf);
                    $totalb = count($bf) ?: 1;
                    foreach ($freqb as $token => $countb) {
                        $map = $this->mapService->buildFeatureIndex();
                        if (isset($map[$token])) {
                            $vecBed[$map[$token]] = $countb / $totalb;
                        }
                    }
                    $simBed = SimilarityService::cosineSimilarity($userVector, $vecBed);
                    if ($simBed > $bestBedSim) {
                        $bestBedSim = $simBed;
                        $bestBed = $bed;
                    }
                }
            }

            $results[] = [
                'building_id' => $building->id,
                'building' => $building,
                'similarity' => $item['similarity'],
                'final_score' => $item['final_score'],
                'best_room' => $bestRoom,
                'best_room_similarity' => $bestRoomSim,
                'best_bed' => $bestBed,
                'best_bed_similarity' => $bestBedSim,
            ];
        }

        // present results (you may want to map model fields for frontend)
        return $results;
    }

    protected function normalize($value, $min, $max, $invert = false): float
    {
        if ($max == $min) return 0.5; // default mid if no variance
        $v = ($value - $min) / ($max - $min);
        if ($invert) $v = 1 - $v; // e.g., for price/distance lower is better
        return max(0.0, min(1.0, (float)$v));
    }

    // haversine (km)
    protected function haversineDistance($lat1, $lon1, $lat2, $lon2): float
    {
        $earthRadius = 6371; // km
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }
}