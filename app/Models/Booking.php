<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $table = 'bookings';

    protected $fillable = [
        'user_id',
        'bookable_id',
        'bookable_type',
        'start_date',
        'month_count',
        'total_price',
        'special_request',
        'agreed_to_terms',
        'warned',
        'status',
        'payment_method',
    ];

    /**
     * Relationships
     */
    protected function casts()
    {
        return [
            'warned' => "datetime",
        ];
    }
    public function bookable()
    {
        return $this->morphTo();
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function receipt()
    {
        return $this->hasOne(Receipt::class);
    }
    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }
    public function rejections()
    {
        return $this->morphMany(Rejection::class, 'rejectable');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function ratings(){
        return $this->hasMany(Rating::class);
    }
    public function cancels(){
        return $this->hasMany(Cancel::class);
    }
}
