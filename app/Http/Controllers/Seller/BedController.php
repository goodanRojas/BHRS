<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Storage};
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

    public function updateMainImage(Request $request, Bed $bed)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Delete old main image if exists
        if ($bed->image && Storage::disk('public')->exists($bed->image)) {
            Storage::disk('public')->delete($bed->image);
        }

        $imagePath = $request->file('image')->store('images', 'public');
        $bed->update(['image' => $imagePath]);

        return response()->json([
            'message' => 'Main image updated successfully',
            'image' => $imagePath,
        ]);
    }
    public function updateCarouselImage(Request $request, Media $media)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Delete old file
        if ($media->file_path && Storage::disk('public')->exists($media->file_path)) {
            Storage::disk('public')->delete($media->file_path);
        }

        $imagePath = $request->file('image')->store('images', 'public');
        $media->update(['file_path' => $imagePath]);

        return response()->json([
            'message' => 'Carousel image updated successfully',
            'image' => $imagePath,
        ]);
    }
    public function deleteCarouselImage(Media $media)
    {
        if ($media->file_path && Storage::disk('public')->exists($media->file_path)) {
            Storage::disk('public')->delete($media->file_path);
        }

        $media->delete();

        return response()->json([
            'success' => 'Carousel image deleted successfully',
        ]);
    }

    public function deleteBed(Bed $bed)
    {
        if ($bed->bookings()->exists()) {
            return redirect()->back()->with('error', 'You cannot delete this bed because it has bookings.');
        }
        $room = $bed->room;
        $bed->delete();
        return redirect()
            ->route('seller.room.details', $room) // pass the model, not just id
            ->with('success', 'Bed deleted successfully.')
            ->with('message', 'Bed deleted.');


    }

    public function updateName(Request $request, Bed $bed)
    {
        $bed->name = $request->name;
        $bed->save();

        return response()->json([
            'name' => $bed->name
        ]);
    }
    public function updatePrice(Request $request, Bed $bed)
    {
        $bed->price = $request->price;
        $bed->save();
        return response()->json([
            'price' => $bed->price
        ]);
    }
}
