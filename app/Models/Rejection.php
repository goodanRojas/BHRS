<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rejection extends Model
{
    protected $fillable = [
        'rejectable_id', 'rejectable_type', 'reason','status' , 'rejected_by'
    ];

    // Polymorphic relation to the rejectable model (Booking, Task, etc.)
    public function rejectable()
    {
        return $this->morphTo();
    }
}
