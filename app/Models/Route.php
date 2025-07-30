<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'building_id',
        'coordinates',
        'category',
        'destination_id',
    ];

    protected $casts = [
        'coordinates' => 'array',
    ];

    public function building()
    {
        return $this->belongsTo(Building::class);
    }

    public function destination(){
        return $this->belongsTo(RouteDestination::class, 'destination_id');
    }
}
