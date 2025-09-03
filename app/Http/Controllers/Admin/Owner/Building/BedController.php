<?php

namespace App\Http\Controllers\Admin\Owner\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Bed, Feature};
use Inertia\Inertia;
class BedController extends Controller
{

    public function addBed(Request $request)
    {
        // Log::info($request->all());
        $validated = $request->validate([
            'image' => 'required|image',
            'price' => 'required|numeric',
            'name' => 'required|string|max:255',
            'room_id' => 'required|exists:rooms,id'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('images', $image->hashName(), 'public');
        }

        $beds = Bed::create([
            'room_id' => $validated['room_id'],
            'name' => $validated['name'],
            'image' => $imagePath,
            'price' => $validated['price'],
        ]);
        $id = $beds->id;
        $bed = Bed::find($id);
        return response()->json([
            'bed' => $bed
        ]);
    }
    public function showBed($id)
    {
        $bed = Bed::with('images', 'room.building', 'features')->find($id);
        return Inertia::render('Admin/Owner/Building/Room/Bed', [
            'bed' => $bed
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
}
