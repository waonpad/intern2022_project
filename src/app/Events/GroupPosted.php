<?php
namespace App\Events;

use App\Models\GroupPost;
use App\Models\User;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class GroupPosted implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * @var GroupPost
     */
    public $group_post;

    public $user;

    /**
     * Posted constructor.
     * @param GroupPost $group_post
     */
    public function __construct(GroupPost $group_post, User $user)
    {
        $this->group_post = $group_post;

        $this->user = $user;
    }

    /**
     * @return Channel|Channel[]
     */
    public function broadcastOn()
    {
        return new PresenceChannel('group_post.' . $this->group_post->group_id);
    }
}