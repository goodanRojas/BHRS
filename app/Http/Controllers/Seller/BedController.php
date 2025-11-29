<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Storage};
use App\Models\{Bed, Media, Feature, Seller, AdminLog};

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

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Uploaded an image for bed ID ' . $request->id,
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

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Added a feature (' . $request->name . ') to bed ID ' . $request->featureable_id,
        ]);

        return response()->json([
            'feature' => $feature
        ]);
    }
    public function deleteFeature($id)
    {
        // Find the feature by ID
        $feature = Feature::findOrFail($id);

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Deleted a feature (' . $feature->name . ') from bed ID ' . $feature->featureable_id,
        ]);
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

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Updated description for bed ID ' . $request->id,
        ]);
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

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Updated main image for bed ID ' . $bed->id,
        ]);

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

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Updated carousel image ID ' . $media->id . ' for bed ID ' . $media->imageable_id,
        ]);

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
        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Deleted carousel image ID ' . $media->id . ' for bed ID ' . $media->imageable_id,
        ]);
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

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Deleted bed ID ' . $bed->id,
        ]);

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

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Updated name for bed ID ' . $bed->id,
        ]);
        return response()->json([
            'name' => $bed->name
        ]);
    }
    public function updatePrice(Request $request, Bed $bed)
    {
        $bed->price = $request->price;
        $bed->save();

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Updated price for bed ID ' . $bed->id,
        ]);

        return response()->json([
            'price' => $bed->price
        ]);
    }

    public function toggleIsOccupied(Request $request, Bed $bed)
    {
        $bed->is_occupied = !$bed->is_occupied;
        $bed->save();

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Toggled occupancy for bed ID ' . $bed->id . ' to ' . ($bed->is_occupied ? 'occupied' : 'unoccupied'),
        ]);

        return response()->json([
            'is_occupied' => $bed->is_occupied
        ]);
    }
}
