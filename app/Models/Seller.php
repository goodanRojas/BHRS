<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Seller extends Authenticatable implements MustVerifyEmail
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

    public function subscription()
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function hasFeature($feature)
    {
        $plan = $this->subscription?->plan; // SubscriptionPlan object or null

        if (!$plan)
            return false; // no subscription or plan

        // $plan->features is already an array thanks to casts
        return in_array($feature, $plan->features ?? []);
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

    public function aiResponseStatus()
    {
        return $this->hasMany(AiResponseStatus::class, 'seller_id');
    }

    public function buildingApplications()
    {
        return $this->hasMany(BuildingApplication::class);
    }

    public function conversationAiSettings()
    {
        return $this->hasMany(ConversationAiSetting::class);
    }

    public function rulesAndRegulations()
    {
        return $this->hasMany(RulesAndRegulation::class);
    }
}
