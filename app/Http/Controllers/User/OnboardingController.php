<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Http};
use App\Models\{UserOnBoarding, Feature};
class OnboardingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'source' => 'nullable|string|max:255',
            'other_source' => 'nullable|string|max:255',
            'bed_preference' => 'required|array|min:1|max:5', // <- this is key
        ]);
        UserOnBoarding::create([
            'user_id' => auth()->id(),
            'source' => $validated['source'] ?? null, // Handle nullable field
            'other_source' => $validated['other_source'] ?? null, // Handle nullable field
            'bed_preference' => $validated['bed_preference'],
        ]);

        $user = auth()->user();
        $user->has_completed_onboarding = true;
        $user->save();

        return redirect()->route('to.user.buildings');
    }

    public function show(Request $request)
    {
        if (!auth()->check() || auth()->user()->has_completed_onboarding) {
            return redirect()->route('home');
        }

        return Inertia::render('Home/Preferences/OnboardingPage', [
            'user' => auth()->user(),
        ]);
    }

    
    public function getPreferences()
    {
        $features = Feature::pluck('name')->toArray();

        if (empty($features)) {
            return response()->json(['preferences' => []]);
        }

        $apiKey = env('OPENAI_API_KEY');

        // 1. Generate embeddings for each feature
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
        ])->timeout(120)->post('https://api.openai.com/v1/embeddings', [
                    'model' => 'text-embedding-3-small',
                    'input' => $features,
                ]);

        $embeddings = collect($response->json('data'))
            ->pluck('embedding')
            ->toArray();

        $distinct = [];
        $distinctEmbeddings = [];

        foreach ($features as $i => $feature) {
            $currentEmbedding = $embeddings[$i];
            $isDuplicate = false;

            foreach ($distinctEmbeddings as $existingEmbedding) {
                // Cosine similarity
                $similarity = $this->cosineSimilarity($currentEmbedding, $existingEmbedding);
                if ($similarity > 0.85) { // 0.85 = threshold for "same thought"
                    $isDuplicate = true;
                    break;
                }
            }

            if (!$isDuplicate) {
                $distinct[] = $feature;
                $distinctEmbeddings[] = $currentEmbedding;
            }
        }
        return response()->json(['preferences' => $distinct]);
    }

    /**
     * Compute cosine similarity between two vectors
     */
    private function cosineSimilarity(array $vecA, array $vecB)
    {
        $dot = 0;
        $normA = 0;
        $normB = 0;

        foreach ($vecA as $i => $a) {
            $b = $vecB[$i];
            $dot += $a * $b;
            $normA += $a * $a;
            $normB += $b * $b;
        }

        return $dot / (sqrt($normA) * sqrt($normB));
    }


}
