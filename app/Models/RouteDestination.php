<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RouteDestination extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'image', 'latitude', 'longitude', 'category', 'description'];

    public function routes()
    {
        return $this->hasMany(Route::class, 'destination_id');
    }
}
