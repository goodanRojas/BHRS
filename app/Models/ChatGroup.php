<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatGroup extends Model
{
    use HasFactory;
    protected $table = 'chat_groups';
    protected $fillable = ['name', 'creator_id'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'chat_group_members', 'group_id', 'user_id')	
                    ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(ChatGroupMessage::class, 'group_id');
    }
}
