<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TestResult;
use Carbon\Carbon;

class TestResultSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all students
        $students = User::where('role', 'student')->get();

        if ($students->count() === 0) {
            $this->command->info('No students found. Please seed users first.');
            return;
        }

        // Generate mock data for the last 10 days for better trend visualization
        for ($daysAgo = 0; $daysAgo <= 10; $daysAgo++) {
            $date = Carbon::now()->subDays($daysAgo);
            
            // Randomly decide how many assessments happened this day (e.g., 0 to 5)
            $count = rand(0, 5);

            for ($k = 0; $k < $count; $k++) {
                // Pick a random student
                $student = $students->random();

                // Generate random scores
                $dep = rand(0, 42);
                $anx = rand(0, 42);
                $str = rand(0, 42);

                TestResult::create([
                    'user_id' => $student->id,
                    'depression_score' => $dep,
                    'anxiety_score' => $anx,
                    'stress_score' => $str,
                    'depression_level' => $this->calculateLevel($dep),
                    'anxiety_level' => $this->calculateLevel($anx),
                    'stress_level' => $this->calculateLevel($str),
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);
            }
        }
    }

    private function calculateLevel($score)
    {
        // Simple DASS-21/42 approximation for dummy data
        if ($score <= 9) return 'Normal';
        if ($score <= 13) return 'Ringan';
        if ($score <= 20) return 'Sedang';
        if ($score <= 27) return 'Parah';
        return 'Sangat Parah';
    }
}
