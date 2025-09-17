<?php

namespace App\Http\Controllers\Admin\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RulesAndRegulation;
use Illuminate\Support\Facades\Log;
class RulesController extends Controller
{
    public function find($id, $sellerId)
    {
        Log::info($sellerId);
        $rules = RulesAndRegulation::where('building_id', $id)
            ->where('landowner_id', $sellerId)
            ->where('status', 1)
            ->get(['id', 'title', 'description']);
        Log::info($rules);
        return response()->json(['rules' => $rules]);
    }

    // Add a rule
    public function store(Request $request, $id, $sellerId)
    {

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $rule = RulesAndRegulation::create([
            'landowner_id' => $sellerId,
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
        

        $rule->delete();

        return response()->json(['message' => 'Rule deleted successfully']);
    }
}
