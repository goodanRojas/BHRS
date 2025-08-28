<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildingApplication extends Model
{
    protected $table = 'building_applications';
    protected $fillable = [
        'seller_id',
        'name',
        'address',
        'number_of_floors',
        'bir',
        'fire_safety_certificate',
        'number_of_rooms',
        'amenities',
    ];
    protected $casts = [
        'address' => 'array',
        'amenities' => 'array',
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }
}
