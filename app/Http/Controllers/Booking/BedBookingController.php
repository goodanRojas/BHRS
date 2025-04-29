<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Bed;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use GlennRaya\Xendivel\Xendivel;
use GlennRaya\Xendivel\Services\EWalletService;

class BedBookingController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Bed $bed)
  {
    $bed->load("bookings", "room.building");

    return Inertia::render('Home/Booking/BedBooking', [
      'bed' => $bed,
    ]);
  }



  public function bookBed(Request $request, $bedId)
  {

    if ($request->payment_method == 'gcash') {
      Log::info('gcash');
      return redirect()->route('xendivel.checkout');
    } else {
      Log::info($request);
      $request->validate([
        'start_date' => 'required|date',
        'month_count' => 'required|integer|min:1',
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'required|string|max:20',
        'address' => 'required|string|max:255',
        'payment_method' => 'required|in:cash,gcash',
        'agreedToTerms' => 'required|accepted',
      ]);

      $bed = Bed::findOrFail($bedId);
      $startDate = Carbon::parse($request->start_date);
      $endDate =  $startDate->copy()->addMonths($request->month_count);

      $totalPrice = $bed->price ?? $bed->price;
      $totalPrice *= $request->month_count;




      $booking = Booking::create([
        'user_id' => auth()->id(),
        'bookable_id' => $bed->id,
        'bookable_type' => Bed::class,
        'start_date' => $startDate,
        'end_date' => $endDate,
        'total_price' => $totalPrice,
        'status' => 'pending',
      ]);

      return response()->json(['success' => true, 'booking' => $booking]);
    }
  }
}
