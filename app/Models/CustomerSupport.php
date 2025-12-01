<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerSupport extends Model
{
    protected $fillable = [
        'supportable_id',
        'supportable_type',
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

    public function supportable()
    {
        return $this->morphTo();
    }

}
