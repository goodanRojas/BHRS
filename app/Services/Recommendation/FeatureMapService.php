<?php 

namespace App\Services\Recommendation;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Models\{Feature, UserOnBoarding};

class FeatureMapService
{
    protected const CACHE_KEY = 'knn_feature_map_v1';
    protected const CACHE_TTL = 60 * 60 * 24; // 1 day

    // Extend this map as needed.
    protected static array $SYNONYM_MAP = [
        // normalize many variants to canonical token
        'piso wifi' => 'free_wifi',
        'free wi-fi access' => 'free_wifi',
        'free wifi' => 'free_wifi',
        'wifi' => 'free_wifi',

        'free water' => 'free_water',
        'water included' => 'free_water',
        'water and electricity included' => 'free_water',

        'free electricity' => 'free_electricity',
        'electricity included' => 'free_electricity',

        'ceiling fan' => 'ceiling_fan',
        'fan' => 'ceiling_fan',

        'air conditioning' => 'air_conditioning',
        'ac' => 'air_conditioning',

        'privacy curtain' => 'privacy_curtain',
        'near cr' => 'near_cr',
        'lower bunk' => 'lower_bunk',
        'upper bunk' => 'upper_bunk',
        'wooden frame' => 'wooden_frame',
        'group rooms' => 'group_rooms'
        // ... add more synonyms as you find them
    ];

    public static function normalize(string $raw): string
    {
        $s = Str::lower(trim($raw));
        $s = preg_replace('/[^\p{L}\p{N}\s\-]/u', '', $s); // remove punctuation
        $s = preg_replace('/\s+/', ' ', $s);

        // direct match synonyms
        if (isset(self::$SYNONYM_MAP[$s])) {
            return self::$SYNONYM_MAP[$s];
        }

        // try heuristics (strip 'free', etc.)
        $s = str_replace(' ', '_', $s);
        return $s;
    }

    public function buildFeatureIndex(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            $features = Feature::pluck('name')->toArray();

            // include user onboarding options too
            $userChoices = UserOnBoarding::pluck('bed_preference')->toArray();
            $flatUserChoices = [];
            foreach ($userChoices as $arr) {
                if (is_array($arr)) {
                    $flatUserChoices = array_merge($flatUserChoices, $arr);
                } else {
                    // maybe stored as JSON string:
                    $decoded = json_decode($arr, true);
                    if (is_array($decoded)) $flatUserChoices = array_merge($flatUserChoices, $decoded);
                }
            }

            $all = array_merge($features, $flatUserChoices);
            $normalized = array_map(fn($r) => self::normalize((string)$r), $all);
            $unique = array_values(array_unique(array_filter($normalized)));

            // index map: token => index position
            $map = [];
            foreach ($unique as $i => $token) {
                $map[$token] = $i;
            }

            return $map;
        });
    }
}