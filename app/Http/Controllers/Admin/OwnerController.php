<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log, Hash};
use Inertia\Inertia;
use App\Models\{Seller, Address, Admin, AdminLog};

class OwnerController extends Controller
{
    /* Display the initial owners */
    public function index(Request $request)
    {

        $owners = Seller::orderBy('created_at', 'desc')->paginate(10);

        return inertia('Admin/Owner/Owners', [
            'owners' => $owners,
        ]);
    }

    /* Create owner */
    public function create(Request $request)
    {
        Log::info($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:sellers,email',
            'phone' => 'required|string|max:255',
            'password' => 'required|min:8',
            'address.barangay' => 'required|string|max:255',
            'address.city' => 'required|string|max:255',
            'address.province' => 'required|string|max:255',
            'address.region' => 'required|string|max:255',
        ]);


        $seller = Seller::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status' => 1,
            'phone' => $validated['phone'],
        ]);

        Log::info($seller->toArray());
        if ($seller) {
            $address = Address::create([
                'addressable_id' => $seller->id,
                'addressable_type' => Seller::class,
                'address' => [
                    'barangay' => $validated['address']['barangay'],
                    'city' => $validated['address']['city'],
                    'province' => $validated['address']['province'],
                    'region' => $validated['address']['region'],
                ],
            ]);
        }

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Created owner account: ' . $seller->name,
        ]);

        return redirect()->route('admin.owners');
    }


    public function createShow(Request $request)
    {
        return Inertia::render('Admin/Owner/CreateAccount');
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
            $owner->status = !$owner->status;
            $owner->save();

            AdminLog::create([
                'actor_type' => Admin::class,
                'actor_id' => auth()->guard('admin')->id(),
                'name' => auth()->guard('admin')->user()->name,
                'activity' => ($owner->status ? 'Activated' : 'Deactivated') . ' owner account: ' . $owner->name,
            ]);

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
        $owner->password = Hash::make($password);

        $owner->save();

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Updated owner account: ' . $owner->name,
        ]);

        return redirect()->back()->with('success', 'User successfully update');
    }

    public function owner($id)
    {
        $owner = Seller::with(['address', 'buildings'])->find($id);
        if (!$owner) {
            return redirect()->back()->with('error', 'Owner not found');
        }

        return Inertia::render('Admin/Owner/Owner', [
            'owner' => $owner,
        ]);
    }
}
