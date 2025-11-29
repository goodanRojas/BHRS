<?php

namespace App\Http\Controllers\Admin\CustomerSupport;

use App\Events\User\CustomerSupportResponseEvent;
use App\Http\Controllers\Controller;
use App\Models\CustomerSupport;
use Illuminate\Http\Request;

class CustomerSupportController extends Controller
{
    public function index()
    {
        $tickets = CustomerSupport::with('user')
            ->orderBy('created_at', 'desc')
            ->get();
        return inertia('Admin/CustomerSupport/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function show($id)
    {
        $ticket = CustomerSupport::with('user')->findOrFail($id);
        return inertia('Admin/CustomerSupport/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Request $request, CustomerSupport $ticket)
    {
        $request->validate([
            'response' => 'required|string',
        ]);

        $ticket->update([
            'response' => $request->response,
            'status' => 'in_progress', // mark as in_progress when admin replies
            'resolved_at' => null,
        ]);

        event(new CustomerSupportResponseEvent($ticket));

        return redirect()->back()->with([
            'success' => true,
            'message' => 'Response submitted successfully!',
        ]);
    }

    /**
     * Update an existing response
     */
    public function update(Request $request, CustomerSupport $ticket)
    {
        $request->validate([
            'response' => 'required|string',
        ]);

        $ticket->update([
            'response' => $request->response,
            // optionally change status if needed
        ]);
        event(new CustomerSupportResponseEvent($ticket));

        return redirect()->back()->with([
            'success' => true,
            'message' => 'Response updated successfully!',
        ]);

    }
}
