<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OwnerPaymentInfo extends Model
{
    protected $fillable = [
        'owner_id',
        'gcash_name',
        'gcash_number',
        'qr_code',
    ];
    protected $table = 'owner_payment_infos';
    public function owner()
    {
        return $this->belongsTo(Seller::class, 'owner_id');
    }
    public function getGcashNumberAttribute($value)
    {
        return $value ? decrypt($value) : null;
    }
    public function setGcashNumberAttribute($value)
    {
        $this->attributes['gcash_number'] = $value ? encrypt($value) : null;
    }
}
