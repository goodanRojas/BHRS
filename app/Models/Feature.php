<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $fillable = [
        'name',
        'description',
        'featureable_id',
        'featureable_type'
    ];
    public function featureable()
    {
        return $this->morphTo();
    }
}
