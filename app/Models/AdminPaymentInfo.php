<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminPaymentInfo extends Model
{
    protected $fillable = [
        'admin_id',
        'gcash_name',
        'gcash_number',
        'qr_code',
    ];
    protected $table = 'admin_payment_infos';
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
