<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    /** @use HasFactory<\Database\Factories\BuildingFactory> */
    use HasFactory;

    protected $table = 'buildings';

    protected $fillable = [
        'seller_id',
        'name',
        'image',
        'latitude',
        'longitude',
        'number_of_floors',
        'bir',
        'business_permit',
        'status'
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function feedback()
    {
        return $this->morphMany(Feedback::class, 'feedbackable');
    }

    public function favorites()
    {
        return $this->morphMany(Favorite::class, 'favoritable');
    }

    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function images()
    {
         return $this->morphMany(Media::class, 'imageable');
    }
    public function features()
    {
        return $this->morphMany(Feature::class, 'featureable');
    }

}
