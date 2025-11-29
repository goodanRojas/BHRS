<?php

namespace App\Http\Controllers\Admin\Owner\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Storage};
use App\Models\{Building, RouteDestination, Admin, AdminLog};
class Map extends Controller
{
    public function index()
    {
        $buildings = Building::all();
        $destinations = RouteDestination::all(); // Assuming you have a Destination model
        return Inertia::render('Admin/Owner/Building/MapDestination', [
            'buildings' => $buildings,
            'destinations' => $destinations
        ]);
    }
    public function store(Request $request)
    {
        Log::info('Store method called with request:', $request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'image' => 'nullable|image|max:2048', // Assuming you want to handle image uploads
        ]);
        $destination = new RouteDestination();
        $destination->name = $validated['name'];
        $destination->category = $validated['category'];
        $destination->description = $validated['description'];
        $destination->latitude = $validated['latitude'];
        $destination->longitude = $validated['longitude'];
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('destination_images', 'public');
            $destination->image = $imagePath;
        }

        $destination->save();

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Created route destination: ' . $destination->name,
        ]);
        return back()->with([
            'success' => 'Destination created successfully.',
            'destination' => $destination
        ]);
    }

    public function destroy($id)
    {
        $destination = RouteDestination::find($id);
        if ($destination) {
            AdminLog::create([
                'actor_type' => Admin::class,
                'actor_id' => auth()->guard('admin')->id(),
                'name' => auth()->guard('admin')->user()->name,
                'activity' => 'Deleted route destination: ' . $destination->name,
            ]);
            $destination->delete();
            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false, 'message' => 'Destination not found.'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $destination = RouteDestination::find($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);
        $destination->name = $validated['name'];
        $destination->category = $validated['category'];
        $destination->description = $validated['description'];
        $destination->latitude = $validated['latitude'];
        $destination->longitude = $validated['longitude'];
        if ($request->hasFile('image')) {
            // Optional: delete old image
            if ($destination->image && Storage::exists($destination->image)) {
                Storage::delete($destination->image);
            }

            $path = $request->file('image')->store('destination_images', 'public');
            $destination->image = $path;
        }

        $destination->save();

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Updated route destination: ' . $destination->name,
        ]);

        return back()->with('success', 'Destination updated successfully.');
    }
}
