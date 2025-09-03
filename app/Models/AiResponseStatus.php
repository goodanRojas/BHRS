<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiResponseStatus extends Model
{   
    protected $table = 'ai_response_statuses';
    protected $fillable = [
        'status',
        'seller_id',
        'user_id',
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
