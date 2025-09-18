<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
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

    public function getPrefrences()
    {
        $features = Feature::select('name')->distinct()->pluck('name');

        return response()->json([
            'preferences' => $features->toArray(),
        ]);

    }
}
