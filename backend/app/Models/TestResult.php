<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'depression_score',
        'anxiety_score',
        'stress_score',
        'depression_level',
        'anxiety_level',
        'stress_level'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
