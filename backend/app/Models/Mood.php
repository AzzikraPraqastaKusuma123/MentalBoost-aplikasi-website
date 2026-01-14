<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mood extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'emoji',
        'keywords',
        'note'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
