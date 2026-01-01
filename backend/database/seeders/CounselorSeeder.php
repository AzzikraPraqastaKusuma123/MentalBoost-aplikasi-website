<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CounselorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $counselors = [
            [
                'name' => 'Faiz Syihab',
                'email' => 'faiz.syihab@mentalboost.id',
                'role' => 'counselor',
                'password' => Hash::make('password123'),
                'nim' => 'C001'
            ],
            [
                'name' => 'Rifqi Akmal',
                'email' => 'rifqi.akmal@mentalboost.id',
                'role' => 'counselor',
                'password' => Hash::make('password123'),
                'nim' => 'C002'
            ],
            [
                'name' => 'Zikri Ramadhan',
                'email' => 'zikri.ramadhan@mentalboost.id',
                'role' => 'counselor',
                'password' => Hash::make('password123'),
                'nim' => 'C003'
            ],
        ];

        foreach ($counselors as $counselor) {
            User::firstOrCreate(
                ['email' => $counselor['email']],
                $counselor
            );
        }
    }
}
