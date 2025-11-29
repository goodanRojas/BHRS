<?php

namespace App\Http\Controllers\Admin\Logs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdminLog;
use Inertia\Inertia;
class LogsController extends Controller
{
    public function index()
    {
        $logs = AdminLog::all();
        return Inertia::render('Admin/Logs/Logs', [
            'logs' => $logs
        ]);
    }
}
