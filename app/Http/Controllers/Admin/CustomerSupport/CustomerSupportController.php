<?php

namespace App\Http\Controllers\Admin\CustomerSupport;

use App\Events\User\CustomerSupportResponseEvent;
use App\Http\Controllers\Controller;
use App\Models\CustomerSupport;
use Illuminate\Http\Request;

class CustomerSupportController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search', '');
        $allowedSorts = ['created_at', 'priority', 'status', 'category', 'supportable_id', 'supportable_type'];
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'created_at';
        }
        $tickets = CustomerSupport::with('supportable')
            ->when($search, function ($query, $search) {
               $query->where('message', 'like', "%{$search}%")
                ->orWhere('category', 'like', "%{$search}%")
                ->orWhereHas('supportable', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy($sort, $direction)
            ->paginate(10);
        return inertia('Admin/CustomerSupport/Index', [
            'tickets' => $tickets,
            'sort' => $sort,
            'direction' => $direction,
            'search' => $search,
        ]);
    }

    public function show($id)
    {
        $ticket = CustomerSupport::with('supportable')->findOrFail($id);
        $ticket->update([
            'admin_read_at' => now(),
        ]);
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
            'read_at' => null
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
            'read_at' => null
            // optionally change status if needed
        ]);
        event(new CustomerSupportResponseEvent($ticket));

        return redirect()->back()->with([
            'success' => true,
            'message' => 'Response updated successfully!',
        ]);

    }
}
