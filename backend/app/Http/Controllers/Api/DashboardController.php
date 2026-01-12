<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TestResult;
use App\Models\Message; // If needed for message stats

class DashboardController extends Controller
{
    public function counselorStats()
    {
        // Total Users
        $totalUsers = User::where('role', 'student')->count();

        // Assessments Today
        $assessmentsToday = TestResult::whereDate('created_at', today())->count();

        // High Risk Users (Severe or Ext Severe in any category)
        $highRiskUsers = TestResult::where(function($q) {
            $q->whereIn('depression_level', ['Parah', 'Sangat Parah'])
              ->orWhereIn('anxiety_level', ['Parah', 'Sangat Parah'])
              ->orWhereIn('stress_level', ['Parah', 'Sangat Parah']);
        })->distinct('user_id')->count();

        // Chart Data: Stress Level Distribution (Pie Chart)
        // Taking the latest result for each user for accurate "current state"
        $latestResults = TestResult::select('user_id', 'stress_level')
            ->whereIn('id', function($q) {
                $q->selectRaw('MAX(id)')->from('test_results')->groupBy('user_id');
            })->get();
        
        $stressDist = [
            'Normal' => 0, 'Ringan' => 0, 'Sedang' => 0, 'Parah' => 0, 'Sangat Parah' => 0
        ];
        foreach ($latestResults as $res) {
            if (isset($stressDist[$res->stress_level])) {
                $stressDist[$res->stress_level]++;
            }
        }

        // Chart Data: Assessments Last 7 Days (Bar Chart)
        $weeklyTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i)->format('Y-m-d');
            $count = TestResult::whereDate('created_at', $date)->count();
            $weeklyTrend[] = ['date' => $date, 'count' => $count];
        }

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'assessments_today' => $assessmentsToday,
                'high_risk_users' => $highRiskUsers
            ],
            'charts' => [
                'stress_distribution' => $stressDist,
                'weekly_trend' => $weeklyTrend
            ]
        ]);
    }

    public function getUsersList()
    {
        $users = User::where('role', 'student')
            ->with(['testResults' => function($q) {
                $q->latest()->take(1); 
            }])
            ->get()
            ->map(function($user) {
                $latest = $user->testResults->first();
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'joined_at' => $user->created_at->format('d M Y'),
                    'last_assessment' => $latest ? $latest->created_at->format('d M Y') : '-',
                    'status' => $latest ? $latest->stress_level : 'Belum Tes' // Using Stress level as status indicator
                ];
            });

        return response()->json(['data' => $users]);
    }
}
