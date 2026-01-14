<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mood;
use Carbon\Carbon;

class MoodController extends Controller
{
    // Get mood history (last 7 days by default)
    public function index(Request $request)
    {
        $days = $request->query('days', 7);
        $moods = Mood::where('user_id', $request->user()->id)
            ->whereDate('created_at', '>=', Carbon::now()->subDays($days))
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $moods
        ]);
    }

    // Submit a new mood entry
    public function store(Request $request)
    {
        $request->validate([
            'emoji' => 'required|string',
            'keywords' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        // Check if already submitted today? (Optional, maybe allow multiple or restrict to 1)
        // For simple tracking, allowing multiple is fine, but dashboard usually shows daily avg or latest.
        // Let's stick to allowing multiple entries but frontend will show the latest or summary.

        $mood = Mood::create([
            'user_id' => $request->user()->id,
            'emoji' => $request->emoji,
            'keywords' => $request->keywords,
            'note' => $request->note
        ]);

        return response()->json([
            'message' => 'Mood tracked successfully',
            'data' => $mood
        ], 201);
    }
}
