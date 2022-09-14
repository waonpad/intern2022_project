<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrivatePost extends Model
{
    use HasFactory;

    protected $fillable = [
        'send_user_id',
        'receive_user_id',
        'text',
    ];
}
