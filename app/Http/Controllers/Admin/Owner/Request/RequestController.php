<?php

namespace App\Http\Controllers\Admin\Owner\Request;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
class RequestController extends Controller
{
    public function index()
    {
        
        return Inertia::render('Admin/Owner/Request/BuildingRequests');
    }
}
