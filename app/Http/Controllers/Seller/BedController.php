<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\{Bed, Media, Feature};

class BedController extends Controller
{
    public function showBed($id)
    {
        $bed = Bed::with('images', 'room.building', 'features')->find($id);
        return Inertia::render('Seller/Bed', [
            'bed' => $bed
        ]);
    }

    public function uploadImage(Request $request)
    {
        Log::info($request->all());
        $validated = $request->validate([
            'image' => 'required',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('images', $image->hashName(), 'public');
        }
        $media = Media::create([
            'imageable_id' => $request->id,
            'imageable_type' => Bed::class,
            'file_path' => $imagePath,
        ]);
        return response()->json([
            'uploadedImages' => $media
        ]);
    }
    public function addBedFeature(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'featureable_id' => 'required|exists:beds,id', // Assuming featureable_id is related to Building
        ]);
        $feature = Feature::create([
            'name' => $request->name,
            'description' => $request->description,
            'featureable_id' => $request->featureable_id,
            'featureable_type' => Bed::class
        ]);
        return response()->json([
            'feature' => $feature
        ]);
    }
    public function deleteFeature($id)
    {
        // Find the feature by ID
        $feature = Feature::findOrFail($id);

        // Delete the feature
        $feature->delete();


        return response()->json([
            'message' => 'Feature deleted successfully.'
        ], 200);
    }

    public function updateDescription(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
        ]);
        $bed = Bed::find($request->id);
        $bed->description = $validated['description'];
        $bed->save();
        return response()->json([
            'description' => $bed->description
        ]);
    }
}
