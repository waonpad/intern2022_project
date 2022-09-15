<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'screen_name',
        'name'
    ];

    public function groupUsers()
    {
        return $this->belongsToMany('App\Models\User', 'group_user', 'group_id', 'user_id');
    }
}
