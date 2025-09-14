<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'seller_id',
        'plan_id',
        'start_date',
        'end_date',
        'active',
        'status',
        'seller_receipt_path',
        'seller_ref_num',
        'seller_remarks',
        'admin_receipt_path',
        'admin_ref_num',
        'admin_remarks',
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }
    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }
    public function isActive()
    {
        return $this->status === 'active' && $this->end_date && $this->end_date->isFuture();
    }

    public function isExpired()
    {
        return $this->end_date && $this->end_date->isPast();
    }
}
