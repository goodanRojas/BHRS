<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Storage, Auth};
use App\Models\{Building, Feature, Room, Address, Bed, Media};

class BuildingController extends Controller
{
    public function index(Request $request)
    {
        $sellerId = Auth::guard('seller')->id();
        // Fetch all buildings for the seller
        $buildings = Building::with('rooms', 'seller')->where('seller_id', $sellerId)->get();
        return Inertia::render('Seller/Buildings', [
            'initialBuildings' => $buildings,
        ]);
    }
    public function searchBuildings(Request $request)
    {
        $search = $request->query('search');

        $buildings = Building::with('rooms', 'seller')
            ->when(
                $search,
                fn($query) =>
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('address', 'like', '%' . $search . '%');
                })
            )
            ->where('seller_id', Auth::guard('seller')->id())
            ->get();

        return response()->json($buildings);
    }


    public function showBuilding($id)
    {
        $building = Building::with('seller', 'address', 'images', 'rooms', 'features')->find($id);
        Log::info($building);
        return Inertia::render('Seller/Building', [
            'building' => $building
        ]);
    }

    public function addFeature(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'featureable_id' => 'required|exists:buildings,id', // Assuming featureable_id is related to Building
        ]);
        $feature = Feature::create([
            'name' => $request->name,
            'description' => $request->description,
            'featureable_id' => $request->featureable_id,
            'featureable_type' => Building::class
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

    public function addRoom(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('images', $image->hashName(), 'public');
        }

        $rooms = Room::create([
            'building_id' => $request->building_id,
            'name' => $request->name,
            'image' => $imagePath,
        ]);
        return response()->json([
            'room' => $rooms
        ]);
    }

    public function update(Request $request, Building $building)
    {
        // dd($request);
        Log::info('Building Update data');
        Log::info($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|array',
            'address.region' => 'nullable|string',
            'address.province' => 'nullable|string',
            'address.municipality' => 'nullable|string',
            'address.barangay' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'bir' => 'nullable|file|mimes:pdf|max:5120', // optional PDF
            'business_permit' => 'nullable|file|mimes:pdf|max:5120', // optional PDF

        ]);

      
        if ($request->hasFile('bir')) {
            $validated['bir'] = $request->file('bir')->store('buildings/bir', 'public');
        } else {
            $validated['bir'] = $building->bir;
        }

        if ($request->hasFile('business_permit')) {
            $validated['business_permit'] = $request->file('business_permit')->store('buildings/permits', 'public');
        } else {
            $validated['business_permit'] = $building->business_permit;
        }


        $building->update([
            'name' => $validated['name'] ?? $building->name,
            'image' => $validated['image'] ?? $building->image,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'bir' => $validated['bir'],
            'business_permit' => $validated['business_permit'],
        ]);
        $address = Address::where('addressable_id', $building->id)
            ->where('addressable_type', Building::class)
            ->first();
        $address->update([
            'address' => [
                'region' => $request->input('address.region'),
                'province' => $request->input('address.province'),
                'municipality' => $request->input('address.municipality'),
                'barangay' => $request->input('address.barangay'),
            ],
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
        ]);

        return response()->json([
            'message' => 'Building updated successfully',
            'building' => $building,
        ]);
    }

    public function uploadImage(Request $request)
    {
        // Log::info($request->all());
        $validated = $request->validate([
            'image' => 'required',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('images', $image->hashName(), 'public');
        }
        $media = Media::create([
            'imageable_id' => $request->id,
            'imageable_type' => Building::class,
            'file_path' => $imagePath,
        ]);
        Log::info($media);
        return response()->json([
            'uploadedImages' => $media
        ]);
    }
    public function updateMainImage(Request $request, Building $building)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Delete old main image if exists
        if ($building->image && Storage::disk('public')->exists($building->image)) {
            Storage::disk('public')->delete($building->image);
        }

        $imagePath = $request->file('image')->store('images', 'public');
        $building->update(['image' => $imagePath]);

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


}
