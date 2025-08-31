<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'addressable_id',
        'addressable_type',
        'address',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'address' => 'array',
    ];
    public function addressable()
    {
        return $this->morphTo();
    }
}
