<?php

namespace App\Http\Controllers\User\CustomerSupport;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\{User, CustomerSupport};
use App\Events\Admin\NewCustomerSupportEvent;
class CustomerSupportController extends Controller
{
    public function index()
    {
        $tickets = auth()->user()
            ->supportTickets()
            ->with('supportable')
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Home/CustomerSupport/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('customer_support_attachments', 'public');
        } else {
            $attachmentPath = null;
        }

        $ticket = CustomerSupport::create([
            'supportable_id' => auth()->id(),
            'supportable_type' => User::class,
            'email' => $request->email,
            'name' => $request->name,
            'message' => $request->message,
            'attachment' => $attachmentPath,
            'category' => $request->category ? $request->category : null,
        ]);

        $ticket->load('supportable');

        // Broadcast the event to the admins
        event(new NewCustomerSupportEvent($ticket));

        //


        return redirect()->route('customer.support.index')->with([
            'message' => 'Support ticket created successfully.',
            'success' => true,
            'ticket' => $ticket
        ]);

    }

    public function show($id)
    {
        $ticket = CustomerSupport::with(['supportable'])->findOrFail($id);
        $ticket->update([
            'read_at' => now()
        ]);
        return Inertia::render('Home/CustomerSupport/Ticket', [
            'ticket' => $ticket,
        ]);
    }

}
