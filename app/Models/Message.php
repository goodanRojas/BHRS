<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'sender_type',
        'receiver_type',
        'content',
        'is_read',
        'sent_at',
        'sender_deleted_at',
        'receiver_deleted_at',
    ];
    protected $casts = [
    'sender_deleted_at' => 'datetime',
    'receiver_deleted_at' => 'datetime',
];


  public function sender()
    {
        return $this->morphTo();
    }

    public function receiver()
    {
        return $this->morphTo();
    }
}
