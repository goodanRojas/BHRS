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
        'address',
        'latitude',
        'longitude',
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
}
