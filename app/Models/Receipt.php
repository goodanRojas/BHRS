<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $fillable = [
        'booking_id',
        'user_receipt',
        'seller_receipt',
        'amount',
        'payment_method',
        'status',
        'transaction_id',
        'paid_at',
        'user_remarks',
        'user_ref_number',
        'seller_remarks',
        'seller_ref_number',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
