<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TestResult;
use App\Models\DassQuestion;
use Illuminate\Support\Facades\DB;

class AssessmentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     * Expects input: { answers: [ { question_id: 1, value: 0-3 }, ... ] }
     */
    public function store(Request $request)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:dass_questions,id',
            'answers.*.value' => 'required|integer|min:0|max:3',
        ]);

        $answers = $request->input('answers');
        
        // Calculate scores
        // We need to group answers by category (Depression, Anxiety, Stress)
        $questions = DassQuestion::all()->keyBy('id'); // Cache questions

        $depressionSum = 0;
        $anxietySum = 0;
        $stressSum = 0;

        foreach ($answers as $ans) {
            $q = $questions[$ans['question_id']] ?? null;
            if ($q) {
                $val = $ans['value'];
                if ($q->category === 'depression') $depressionSum += $val;
                if ($q->category === 'anxiety') $anxietySum += $val;
                if ($q->category === 'stress') $stressSum += $val;
            }
        }

        // Multiply by 2 (DASS-21 standard)
        $depressionScore = $depressionSum * 2;
        $anxietyScore = $anxietySum * 2;
        $stressScore = $stressSum * 2;

        // Determine Levels
        $depressionLevel = $this->getLevel('depression', $depressionScore);
        $anxietyLevel = $this->getLevel('anxiety', $anxietyScore);
        $stressLevel = $this->getLevel('stress', $stressScore);

        // Save Result
        $result = TestResult::create([
            'user_id' => $request->user()->id,
            'depression_score' => $depressionScore,
            'anxiety_score' => $anxietyScore,
            'stress_score' => $stressScore,
            'depression_level' => $depressionLevel,
            'anxiety_level' => $anxietyLevel,
            'stress_level' => $stressLevel,
        ]);

        return response()->json([
            'msg' => 'Assessment submitted successfully',
            'data' => $result
        ], 201);
    }

    /**
     * Get user history
     */
    public function history(Request $request)
    {
        $history = TestResult::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $history
        ]);
    }

    private function getLevel($category, $score)
    {
        // Thresholds based on DASS-21 * 2
        // Depression: 0-9 Normal, 10-13 Mild, 14-20 Moderate, 21-27 Severe, 28+ Ext. Severe
        // Anxiety: 0-7 Normal, 8-9 Mild, 10-14 Moderate, 15-19 Severe, 20+ Ext. Severe
        // Stress: 0-14 Normal, 15-18 Mild, 19-25 Moderate, 26-33 Severe, 34+ Ext. Severe

        if ($category === 'depression') {
            if ($score <= 9) return 'Normal';
            if ($score <= 13) return 'Ringan';
            if ($score <= 20) return 'Sedang';
            if ($score <= 27) return 'Parah';
            return 'Sangat Parah';
        }

        if ($category === 'anxiety') {
            if ($score <= 7) return 'Normal';
            if ($score <= 9) return 'Ringan';
            if ($score <= 14) return 'Sedang';
            if ($score <= 19) return 'Parah';
            return 'Sangat Parah';
        }

        if ($category === 'stress') {
            if ($score <= 14) return 'Normal';
            if ($score <= 18) return 'Ringan';
            if ($score <= 25) return 'Sedang';
            if ($score <= 33) return 'Parah';
            return 'Sangat Parah';
        }

        return 'Unknown';
    }
}
