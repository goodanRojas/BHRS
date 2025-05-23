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
        'end_date',
        'total_price',
        'fullname',
        'email',
        'phone',
        'special_request',
        'agreed_to_terms',
        'status',
        'payment_method',
    ];

    /**
     * Relationships
     */
    public function bookable()
    {
        return $this->morphTo();
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }
       public function rejections()
    {
        return $this->morphMany(Rejection::class, 'rejectable');
    }
}
