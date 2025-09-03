<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserOnBoarding extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'source',
        'other_source',
        'bed_preference',
    ];
    protected $table = 'user_onboardings';
    protected $casts = [
        'bed_preference' => 'array', // Store as JSON
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
