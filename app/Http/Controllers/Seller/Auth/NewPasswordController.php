<?php

namespace App\Http\Controllers\Seller\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Hash, Password};
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class NewPasswordController extends Controller
{
    public function create(Request $request, $token)
    {
        return inertia('Seller/Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::broker('sellers')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($seller, $password) {
                $seller->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $seller->save();

                event(new PasswordReset($seller));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('seller.login.index')->with('status', __($status))
            : back()->withErrors(['email' => [__($status)]]);
    }
}
