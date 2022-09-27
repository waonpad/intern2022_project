<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'wordle_id',
        'answer',
        'entry_limit',
        'status'
    ];

    public function gameUsers()
    {
        return $this->belongsToMany('App\Models\User', 'game_users', 'game_id', 'user_id');
    }
}
