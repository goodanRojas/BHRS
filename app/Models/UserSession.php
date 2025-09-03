<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSession extends Model
{
     protected $fillable = ['user_id', 'user_type', 'session_data', 'last_activity'];

    /**
     * Get the parent user model (either Seller or Admin).
     */
    public function user()
    {
        return $this->morphTo();
    }
}
