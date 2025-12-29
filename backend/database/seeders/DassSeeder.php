<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing to avoid duplicates if re-run
        DB::table('dass_questions')->truncate();

        $questions = [
            // Stress
            ['question' => 'I found it hard to wind down', 'category' => 'stress'],
            ['question' => 'I tended to over-react to situations', 'category' => 'stress'],
            ['question' => 'I felt that I was using a lot of nervous energy', 'category' => 'stress'],
            ['question' => 'I found myself getting agitated', 'category' => 'stress'],
            ['question' => 'I found it difficult to relax', 'category' => 'stress'],
            ['question' => 'I was intolerant of anything that kept me from getting on with what I was doing', 'category' => 'stress'],
            ['question' => 'I felt that I was rather touchy', 'category' => 'stress'],

            // Anxiety
            ['question' => 'I was aware of dryness of my mouth', 'category' => 'anxiety'],
            ['question' => 'I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)', 'category' => 'anxiety'],
            ['question' => 'I experienced trembling (e.g. in the hands)', 'category' => 'anxiety'],
            ['question' => 'I was worried about situations in which I might panic and make a fool of myself', 'category' => 'anxiety'],
            ['question' => 'I felt I was close to panic', 'category' => 'anxiety'],
            ['question' => 'I felt scared without any good reason', 'category' => 'anxiety'],
            ['question' => 'I felt my heart absent or missing a beat', 'category' => 'anxiety'],

            // Depression
            ['question' => 'I couldn\'t seem to experience any positive feeling at all', 'category' => 'depression'],
            ['question' => 'I found it difficult to work up the initiative to do things', 'category' => 'depression'],
            ['question' => 'I felt that I had nothing to look forward to', 'category' => 'depression'],
            ['question' => 'I felt down-hearted and blue', 'category' => 'depression'],
            ['question' => 'I was unable to become enthusiastic about anything', 'category' => 'depression'],
            ['question' => 'I felt I wasn\'t worth much as a person', 'category' => 'depression'],
            ['question' => 'I felt that life was meaningless', 'category' => 'depression'],
        ];

        foreach ($questions as $index => $q) {
            DB::table('dass_questions')->insert([
                'question' => $q['question'],
                'category' => $q['category'],
                'order' => $index + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
