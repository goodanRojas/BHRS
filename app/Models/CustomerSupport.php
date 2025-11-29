<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerSupport extends Model
{
    protected $fillable = [
        'user_id',
        'email',
        'name',
        'message',
        'response',
        'attachment',
        'category',
        'priority',
        'status',
        'resolved_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
