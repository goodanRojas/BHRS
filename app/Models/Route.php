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
    ];

    protected $casts = [
        'coordinates' => 'array',
    ];

    public function building()
    {
        return $this->belongsTo(Building::class);
    }

}
