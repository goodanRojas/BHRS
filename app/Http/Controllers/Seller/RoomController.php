<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Storage, Auth};
use App\Models\Feedback;
use App\Models\Booking;
use App\Models\{Bed, Room, Media, Feature, };

class RoomController extends Controller
{
    public function showRoom($id)
    {
        $room = Room::with('images', 'building', 'features', 'beds', )->find($id);
        return Inertia::render('Seller/Room', [
            'room' => $room
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
            'imageable_type' => Room::class,
            'file_path' => $imagePath,
        ]);
        return response()->json([
            'uploadedImages' => $media
        ]);
    }

    public function addFeature(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'featureable_id' => 'required|exists:rooms,id', // Assuming featureable_id is related to Building
        ]);
        $feature = Feature::create([
            'name' => $request->name,
            'description' => $request->description,
            'featureable_id' => $request->featureable_id,
            'featureable_type' => Room::class
        ]);
        Log::info($feature);
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

    public function addBed(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'required|image|max:2048',
            'room_id' => 'required|exists:rooms,id'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('images', $image->hashName(), 'public');
        }
        $bed = Bed::create([
            'room_id' => $request->room_id,
            'name' => $request->name,
            'image' => $imagePath,
            'price' => $request->price,
        ]);
        return response()->json([
            'bed' => $bed
        ]);
    }

    public function updateDescription(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
        ]);
        $bed = Room::find($request->id);
        $bed->description = $validated['description'];
        $bed->save();
        return response()->json([
            'description' => $bed->description
        ]);
    }

    public function updateMainImage(Request $request, Room $room)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Delete old main image if exists
        if ($room->image && Storage::disk('public')->exists($room->image)) {
            Storage::disk('public')->delete($room->image);
        }

        $imagePath = $request->file('image')->store('images', 'public');
        $room->update(['image' => $imagePath]);

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

    public function updateName(Request $request, Room $room)
    {
        $room->name = $request->name;
        $room->save();

        return response()->json([
            'name' => $room->name
        ]);
    }
    public function deleteRoom(Room $room)
    {
        if ($room->beds()->whereHas('bookings')->exists()) {
            return redirect()->back()->with('error', 'You cannot delete this bed because it has bookings.');
        }
        $building = $room->building;
        $room->delete();
        return redirect()
            ->route('seller.building.show.building', $building) // pass the model, not just id
            ->with('success', 'Room deleted successfully.')
            ->with('message', 'Room deleted.');


    }
}
