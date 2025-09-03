<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'media';

    // Fillable attributes
    protected $fillable = ['imageable_id', 'imageable_type', 'file_path', 'alt_text', 'order'];

    /**
     * Polymorphic relationship to the owning model (e.g., Room, Bed, etc.)
     */
    public function imageable()
    {
        return $this->morphTo();
    }
}
