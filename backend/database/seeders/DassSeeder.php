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
            ['question' => 'Saya merasa sulit untuk menenangkan diri', 'category' => 'stress'],
            ['question' => 'Saya cenderung bereaksi berlebihan terhadap situasi', 'category' => 'stress'],
            ['question' => 'Saya merasa menghabiskan banyak energi karena cemas', 'category' => 'stress'],
            ['question' => 'Saya merasa mudah gelisah', 'category' => 'stress'],
            ['question' => 'Saya merasa sulit untuk rileks', 'category' => 'stress'],
            ['question' => 'Saya tidak sabaran dengan gangguan saat sedang sibuk', 'category' => 'stress'],
            ['question' => 'Saya merasa mudah tersinggung', 'category' => 'stress'],

            // Anxiety
            ['question' => 'Saya menyadari mulut saya kering', 'category' => 'anxiety'],
            ['question' => 'Saya mengalami kesulitan bernapas (misal: napas cepat)', 'category' => 'anxiety'],
            ['question' => 'Saya mengalami gemetar (misal: pada tangan)', 'category' => 'anxiety'],
            ['question' => 'Saya khawatir akan situasi di mana saya mungkin panik', 'category' => 'anxiety'],
            ['question' => 'Saya merasa hampir panik', 'category' => 'anxiety'],
            ['question' => 'Saya merasa takut tanpa alasan yang jelas', 'category' => 'anxiety'],
            ['question' => 'Saya merasakan jantung berdebar-debar', 'category' => 'anxiety'],

            // Depression
            ['question' => 'Saya tidak bisa merasakan perasaan positif sama sekali', 'category' => 'depression'],
            ['question' => 'Saya sulit berinisiatif untuk melakukan sesuatu', 'category' => 'depression'],
            ['question' => 'Saya merasa tidak ada yang bisa dinantikan', 'category' => 'depression'],
            ['question' => 'Saya merasa sedih dan murung', 'category' => 'depression'],
            ['question' => 'Saya tidak antusias terhadap apa pun', 'category' => 'depression'],
            ['question' => 'Saya merasa tidak berharga sebagai seseorang', 'category' => 'depression'],
            ['question' => 'Saya merasa hidup ini tidak ada artinya', 'category' => 'depression'],
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
