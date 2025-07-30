<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'avatar',
        'name',
        'email',
        'password',
        'phone'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function sentMessages()
    {
        return $this->morphMany(Message::class, 'sender');
    }

    public function receivedMessages()
    {
        return $this->morphMany(Message::class, 'receiver');
    }


    public function chatGroups()
    {
        return $this->belongsToMany(ChatGroup::class, 'chat_group_members')->withTimestamps();
    }

    public function createdGroups()
    {
        return $this->hasMany(ChatGroup::class, 'creator_id');
    }

    public function groupMessages()
    {
        return $this->hasMany(ChatGroupMessage::class, 'sender_id');
    }
    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }
    public function preferences()
    {
        return $this->hasMany(Preference::class);
    }

    public function onBoarding()
    {
        return $this->hasOne(UserOnBoarding::class);
    }

    public function aiResponseStatus()
    {
        return $this->hasMany(AiResponseStatus::class, 'user_id');
    }
}
