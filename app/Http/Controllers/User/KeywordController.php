<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\UserOnBoarding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Feature;
class KeywordController extends Controller
{
    public function getUserPreferences()
    {
        $preferences = Feature::select('name')->distinct()->pluck('name');
        Log::info($preferences);
        return response()->json([
            'preferences' => $preferences,
        ]);

    }
}
