<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DassQuestion;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questions = DassQuestion::orderBy('order', 'asc')->get();
        return response()->json(['data' => $questions]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'category' => 'required|in:stress,anxiety,depression',
            'order' => 'required|integer',
        ]);

        $question = DassQuestion::create($request->all());

        return response()->json([
            'message' => 'Question created successfully',
            'data' => $question
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $question = DassQuestion::findOrFail($id);

        $request->validate([
            'question' => 'required|string',
            'category' => 'required|in:stress,anxiety,depression',
            'order' => 'required|integer',
        ]);

        $question->update($request->all());

        return response()->json([
            'message' => 'Question updated successfully',
            'data' => $question
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $question = DassQuestion::findOrFail($id);
        $question->delete();

        return response()->json([
            'message' => 'Question deleted successfully'
        ]);
    }
}
