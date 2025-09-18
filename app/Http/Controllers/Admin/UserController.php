<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\{Hash, Log};
class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/Users/Users', [
            'users' => $users,
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back()->with('success', 'User created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|min:8',
        ]);
        $user = User::findOrFail($id);
        $user->update([
            'name' => $request->name,
            'password' => Hash::make($request->password),
        ]);

        Log::info($user);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id); // Assuming you're using the `User` model, not `Seller`
        $user->status = !$user->status;
        $user->save();
        return response()->json([
            'success' => true,
        ]);
    }
}
