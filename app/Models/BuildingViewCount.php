<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildingViewCount extends Model
{
    protected $fillable = [
        'building_id',
        'user_id',
        'viewed'
    ];

    protected function casts()
    {
        return [
            'viewed' => 'datetime'
        ];
    }

    public function building()
    {
        return $this->belongsTo(Building::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
