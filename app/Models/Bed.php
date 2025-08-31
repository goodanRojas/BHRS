<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};

class Bed extends Model
{
    /** @use HasFactory<\Database\Factories\BedFactory> */
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'room_id',
        'name',
        'description',
        'image',
        'price',
        'sale_price',
    ];
    public function scopeWithActiveRoom($query)
    {
        return $query->whereHas('room', function ($q) {
            $q->whereNull('deleted_at');
        });
    }

    /**
     * Relationships
     */

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function bookings()
    {
        return $this->morphMany(Booking::class, 'bookable');
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
