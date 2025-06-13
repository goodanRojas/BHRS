<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Seller extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $guard = 'seller';
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'address',
        'phone',
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function buildings()
    {
        return $this->hasMany(Building::class);
    }
    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function sentMessages()
    {
        return $this->morphMany(Message::class, 'sender');
    }

    public function receivedMessages()
    {
        return $this->morphMany(Message::class, 'receiver');
    }

    public function paymentInfo()
    {
        return $this->hasOne(OwnerPaymentInfo::class, 'owner_id');
    }
}
