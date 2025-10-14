<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DefaultMessage extends Model
{
    protected $fillable = [
        'type',
        'owner_id',  
        'message',
        'remarks'
    ];

    public function owner()
    {
        return $this->morphTo();
    }
}
