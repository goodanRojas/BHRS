<?php

namespace App\Http\Controllers\Seller\Message;

use App\Http\Controllers\Controller;
use App\Models\{DefaultMessage, Seller};
use Illuminate\Http\Request;

class DefaultMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $message = DefaultMessage::where('type',  Seller::class)
            ->where('owner_id', auth()->guard('seller')->user()->id)
            ->get();
        return inertia('Seller/Message/DefaultMessage', [
            'message' => $message,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'remarks' => 'nullable|string|max:255',
        ]);

      $message =  DefaultMessage::create([
            'owner_id' => auth()->guard('seller')->user()->id,
            'type' => Seller::class,
            'message' => $request->message,
            'remarks' => $request->remarks,
        ]);

        return redirect()->back()->with(['success', 'Default message added successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $messageId)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'remarks' => 'nullable|string|max:255',
        ]);

        $defaultMessage = DefaultMessage::findOrFail($messageId);
        $defaultMessage->message = $request->message;
        $defaultMessage->remarks = $request->remarks;
        $defaultMessage->save();

        return redirect()->back()->with('success', 'Default message updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $message = DefaultMessage::findOrFail($id);
        $message->delete();
        return response()->json(['message' => 'Default message deleted successfully.']);
    }
}
