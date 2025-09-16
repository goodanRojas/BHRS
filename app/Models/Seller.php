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



    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    // Always return the latest *active* subscription
    public function currentSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>', now());
            })
            ->latest('created_at');
    }

    public function hasPlan($allowedPlans)
    {
        $subscription = $this->currentSubscription()->first();

        if (!$subscription || !$subscription->plan) {
            return false;
        }

        $currentPlan = strtolower($subscription->plan->plan); // assumes `plan` is a relation with a "plan" column

        if (is_array($allowedPlans)) {
            return in_array($currentPlan, array_map('strtolower', $allowedPlans));
        }

        return $currentPlan === strtolower($allowedPlans);
    }

    public function defaultMessages()
    {
        return $this->morphToMany(DefaultMessage::class, 'owner');
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
