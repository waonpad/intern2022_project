<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;

class GroupController extends Controller
{
    public function show(Request $request)
    {
        $group = Group::where('screen_name', $request->screen_name)->first();
        $group_users = $group->groupUsers()->get();

        // https://solomaker.club/how-to-use-laravel-orm-belongs-to-many/

        return response()->json([
            'id'=>$group->id,
            'screen_name'=>$group->screen_name,
            'name'=>$group->name,
            'group_users'=>$group_users,
        ]);
    }
}
