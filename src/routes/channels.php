<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('post', function (){
    return true;
});

// https://laracasts.com/discuss/channels/laravel/laravel-echo-server-with-sanctum

Broadcast::channel('privatepost.{channelname}', function ($user, $channelname){
    // return (int) $user->id === (int) $id;
    return preg_match('/' . $user->id . '/', $channelname);
});