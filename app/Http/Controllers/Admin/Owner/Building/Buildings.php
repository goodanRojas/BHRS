<?php

namespace App\Http\Controllers\Admin\Owner\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Storage};
use Illuminate\Validation\Rule;
use App\Models\{Room, Bed, Building, Address, Seller, Feature, Media};

class Buildings extends Controller
{
    public function index()
    {
        $buildings = Building::with('seller', 'address')->orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/Owner/Building/Buildings', [
            'buildings' => $buildings
        ]);
    }
    public function createShow(Request $request)
    {
        $sellers = Seller::select('id', 'name', 'avatar')->get();
        return Inertia::render('Admin/Owner/Building/CreateBuilding', [
            'sellers' => $sellers
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


    public function store(Request $request)
    {
        // Handle file uploads
        $imagePath = $request->hasFile('image')
            ? $request->file('image')->storeAs('images', $request->file('image')->hashName(), 'public')
            : null;

        $birPath = $request->hasFile('bir')
            ? $request->file('bir')->storeAs('pdfs', $request->file('bir')->hashName(), 'public')
            : null;

        $fireSafetyCertificatePath = $request->hasFile('fireSafetyCertificate')
            ? $request->file('fireSafetyCertificate')->storeAs('pdfs', $request->file('fireSafetyCertificate')->hashName(), 'public')
            : null;

        // Create building
        $building = Building::create([
            'seller_id' => $request->owner_id,
            'image' => $imagePath,
            'name' => $request->buildingName,
            'longitude' => $request->longitude,
            'latitude' => $request->latitude,
            'number_of_floors' => $request->numberOfFloors,
            'bir' => $birPath,
            'business_permit' => $fireSafetyCertificatePath,
            'number_of_rooms' => $request->numberOfRooms,
            'status' => 1,
        ]);

        if ($building) {
            // Create address (nested JSON from form)
            $address = Address::create([
                'addressable_id' => $building->id,
                'addressable_type' => Building::class,
                'address' => $request->address, // will be JSON
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ]);

            // Optional: save amenities if needed
            if ($request->filled('aminities')) {
                foreach ($request->aminities as $amenity) {
                    Feature::create([
                        'featureable_id' => $building->id,
                        'featureable_type' => Building::class,
                        'name' => $amenity,
                    ]);
                }
            }

            return back()->with('message', 'Building successfully created');
        }
        return back()->with('message', 'An error occurred while creating the building');
    }


    public function show($id)
    {
        $building = Building::with('seller', 'address', 'images', 'rooms', 'features')->find($id);
        Log::info($building);
        return Inertia::render('Admin/Owner/Building/Room/Building', [
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
    public function addRoom(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                // Unique per building
                Rule::unique('rooms')->where(fn($query) => $query->where('building_id', $request->building_id)),
            ],
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


}
