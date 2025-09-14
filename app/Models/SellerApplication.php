<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerApplication extends Model
{
    protected $fillable = [
        'fullname',
        'email',
        'user_id',
        'phone',
        'password',
        'landOwnerPaper',
        'bir',
        'status'
    ];

    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
