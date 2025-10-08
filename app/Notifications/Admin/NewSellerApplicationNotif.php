<?php

namespace App\Notifications\Admin;

use App\Models\SellerApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;

class NewSellerApplicationNotif extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $application;
    public function __construct(SellerApplication $application)
    {
        $this->application = $application;
    }

    public function via(object $notifiable): array
    {
        return [/* 'mail', */ 'database', 'broadcast'];
    }
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'New Owner Application',
            'message' => "{$this->application->user->name} applied for owner.",
            'link' => route('admin.applications.show', $this->application->id),
            'meta' => [
                'tenant_name' => $this->application->user->name,
                'owner_name' => $this->application->fullname,
                'email' => $this->application->email,
                'phone' => $this->application->phone,
            ]
        ];
    }
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
             'title' => 'New Owner Application',
            'message' => "{$this->application->user->name} applied for owner.",
            'link' => route('admin.applications.show', $this->application->id),
            'meta' => [
                'tenant_name' => $this->application->user->name,
                'owner_name' => $this->application->fullname,
                'email' => $this->application->email,
                'phone' => $this->application->phone,
            ]
        ]);
    }
}