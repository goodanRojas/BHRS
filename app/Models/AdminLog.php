<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminLog extends Model
{
    protected $fillable = [
        'name',
        'activity',
        'actor_type',
        'actor_id',
    ];

    public function actor()
    {
        return $this->morphTo();
    }
}
