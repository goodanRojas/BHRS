<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DefaultMessage extends Model
{
    protected $fillable = [
        'owner_type',
        'owner_id',  
        'message',
        'type'
    ];

    public function owner()
    {
        return $this->morphTo();
    }
}
