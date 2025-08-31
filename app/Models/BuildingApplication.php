<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildingApplication extends Model
{
    protected $table = 'building_applications';
    protected $fillable = [
        'seller_id',
        'name',
        'number_of_floors',
        'bir',
        'fire_safety_certificate',
        'number_of_rooms',
        'amenities',
        'image',
        'latitude',
        'longitude',
    ];
    protected $casts = [
        'amenities' => 'array',
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }
}
