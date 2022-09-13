<?php
namespace App\Events;

use App\Models\Post;
use App\Models\User;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PrivatePosted implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * @var Post
     */
    public $privatepost;

    public $user;

    /**
     * Posted constructor.
     * @param Post $privatepost
     */
    public function __construct(Post $privatepost, User $user)
    {
        $this->privatepost = $privatepost;
        $this->user = $user;
    }

    /**
     * @return PrivateChannel|PrivateChannel[]
     */
    public function broadcastOn()
    {
        return new PrivateChannel('privatepost.' . $this->user->id);
    }
}