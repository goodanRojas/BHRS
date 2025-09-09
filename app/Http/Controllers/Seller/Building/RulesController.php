<?php

namespace App\Http\Controllers\Seller\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RulesAndRegulation;

class RulesController extends Controller
{
    // Fetch rules
    public function find($id)
    {
        $owner = auth()->guard('seller')->user();
        $rules = RulesAndRegulation::where('building_id', $id)
            ->where('landowner_id', $owner->id)
            ->where('status', 1)
            ->get(['id', 'title', 'description']);
        return response()->json(['rules' => $rules]);
    }

    // Add a rule
    public function store(Request $request, $id)
    {
        $owner = auth()->guard('seller')->user();

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $rule = RulesAndRegulation::create([
            'landowner_id' => $owner->id,
            'building_id' => $id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 1,
        ]);

        return response()->json(['rule' => $rule], 201);
    }

    // Update a rule
    public function update(Request $request, RulesAndRegulation $rule)
    {
        $owner = auth()->guard('seller')->user();

        if ($rule->landowner_id !== $owner->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $rule->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json(['rule' => $rule]);
    }

    // Delete a rule
    public function destroy(RulesAndRegulation $rule)
    {
        $owner = auth()->guard('seller')->user();

        if ($rule->landowner_id !== $owner->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $rule->delete();

        return response()->json(['message' => 'Rule deleted successfully']);
    }
}
