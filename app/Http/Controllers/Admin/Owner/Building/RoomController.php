<?php

namespace App\Http\Controllers\Admin\Owner\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log};
use App\Models\{Room, Bed, Building, Address, Seller, Feature, Admin, AdminLog};
use Inertia\Inertia;

class RoomController extends Controller
{
    public function addRoomFeature(Request $request)
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

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Added Room Feature: ' . $feature->name,
        ]);

        return response()->json([
            'feature' => $feature
        ]);
    }

    public function addRoom(Request $request)
    {
        // Log::info($request->all());
        $validated = $request->validate([
            'image' => 'required|image|max:2048',
            'price' => 'required|numeric',
            'name' => 'required|string|max:255',
            'building_id' => 'required|exists:buildings,id'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('images', $image->hashName(), 'public');
        }

        $rooms = Room::create([
            'building_id' => $validated['building_id'],
            'name' => $validated['name'],
            'image' => $imagePath,
            'price' => $validated['price'],
        ]);
        $id = $rooms->id;
        $room = Room::find($id);
        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Added Room: ' . $room->name,
        ]);
        return response()->json([
            'room' => $room
        ]);
    }

    public function showRoom($id)
    {
        $room = Room::with('images', 'building', 'features', 'beds', )->find($id);
        return Inertia::render('Admin/Owner/Building/Room/Room', [
            'room' => $room
        ]);
    }
}
