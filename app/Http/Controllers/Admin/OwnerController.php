<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
class OwnerController extends Controller
{
    /* Display the initial owners */
    public function index(Request $request)
    {

        $owners = Seller::orderBy('created_at', 'desc')->paginate(10);

        return inertia('Admin/Owner/Owner', [
            'owners' => $owners,
        ]);
    }

    /* Create owner */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:sellers,email',
            'password' => 'required|min:8',
        ]);

        Seller::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'User successfully created');
    }

    /* Get more of the owners */
    public function owners(Request $request)
    {
        $owners = Seller::orderBy('created_at', 'desc')->paginate(10);
        return response()->json([
            'owners' => $owners,
        ]);
    }

    public function toggleStatus($id)
    {
        $owner = Seller::find($id); // Assuming you're using the `Owner` model, not `Seller`

        if ($owner) {
            Log::info('Toggling owner status', ['id' => $owner->id, 'current_status' => $owner->status]);
            // Toggle status (you could also use ternary operator like your code, or use specific strings)
            $owner->status = !$owner->status;
            $owner->save();
            Log::info('Owner status updated', ['id' => $owner->id, 'status' => $owner->status]);
            return response()->json([
                'success' => true,
                'status' => $owner->status,  // Return the updated status
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Owner not found',
        ]);
    }

    public function updateOwner(Request $request, $id)
    {
        // Put an event listener to notify the owner or not.
        $owner = Seller::findOrFail($id); // Assuming you're using the `Owner` model, not `Seller`
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);
        $name = $request->input('name');
        $password = $request->input('password');

        $owner->name = $name;
        $owner->password = Hash::make( $password);

        $owner->save();

        return redirect()->back()->with('success', 'User successfully update');
    }


    public function showRequests(Request $request)
    {

    }
}
