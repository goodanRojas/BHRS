<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Preference extends Model
{
    protected $fillable = [
        'user_id',
        'value',
        'is_public',
        'is_active',
    ];

    protected $casts = [
        'value' => 'array', // Assuming value is stored as JSON
        'is_public' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }
}
