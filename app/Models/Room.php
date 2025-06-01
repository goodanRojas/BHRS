<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    /** @use HasFactory<\Database\Factories\RoomFactory> */
    use HasFactory;

    protected $fillable = [
        'building_id',
        'name',
        'image',
        'price',
        'description',
        'sale_price',
    ];

    /**
     * Relationships
     */

     public function building()
     {
         return $this->belongsTo(Building::class);
     }
 
     public function beds()
     {
         return $this->hasMany(Bed::class);
     }
 
     public function bookings()
     {
         return $this->morphMany(Booking::class, 'bookable');
     }
 
     public function feedbacks()
     {
         return $this->morphMany(Feedback::class, 'feedbackable');
     }
 
     public function favorites()
     {
         return $this->morphMany(Favorite::class, 'favoritable');
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
