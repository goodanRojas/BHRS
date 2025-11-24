<?php

namespace App\Http\Controllers\Admin\Logs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LogsController extends Controller
{
    public function index()
    {
        return inertia('Admin/Logs/Logs');
    }
}
