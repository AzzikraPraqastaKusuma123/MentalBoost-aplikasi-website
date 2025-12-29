<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DassQuestion extends Model
{
    use HasFactory;

    protected $fillable = ['question', 'category', 'order'];
}
