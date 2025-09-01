<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RulesAndRegulation extends Model
{
    protected $table = 'rules_and_regulations';
    protected $fillable = [
        'landowner_id',
        'building_id',
        'title',
        'description',
        'status',
    ];
      public function landowner()
    {
        return $this->belongsTo(Seller::class);
    }
}
