<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Bed;
use App\Models\Booking;
use App\Events\NewBookingCreated;
use App\Models\Address;
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
    $bed->load("bookings.address", "room.building");
    $userPreferences = $booking = Booking::where('user_id', auth()->id())
      ->with('address', 'payment' )
      ->latest()
      ->first();


    return Inertia::render('Home/Booking/BedBooking', [
      'bed' => $bed,
      'userPreferences' => $userPreferences,
    ]);
  }



  public function bookBed(Request $request, $bedId)
  {

    if ($request->payment_method == 'gcash') {
      Log::info('gcash');
      return redirect()->route('xendivel.checkout');
    } else {
      $request->validate([
        'start_date' => 'required|date',
        'month_count' => 'required|integer|min:1',
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'required|string|max:20',
        'payment_method' => 'required|in:cash,gcash',
        'agreedToTerms' => 'required|accepted',
        'address.street' => 'required|string|max:255',
        'address.city' => 'required|string|max:255',
        'address.province' => 'required|string|max:255',
        'address.postal_code' => 'nullable|string|max:20',
        'address.country' => 'required|string|max:100',
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
        'fullname' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone,
        'special_request' => $request->special_request,
        'status' => 'pending',
        'agreed_to_terms' => $request->agreedToTerms,
        'payment_method' => $request->payment_method,
      ]);

      if ($booking) {
        $address = Address::create([
          'addressable_id' => $booking->id,
          'addressable_type' => Booking::class,
          'street' => $request->input('address.street'),
          'barangay' => $request->input('address.barangay'),
          'city' => $request->input('address.city'),
          'province' => $request->input('address.province'),
          'postal_code' => $request->input('address.postal_code'),
          'country' => $request->input('address.country'),
        ]);

        if ($address) {
          $booking->load('bookable.room.building.seller');
          $monthCount = $request->month_count;
          event(new NewBookingCreated($booking,  $monthCount));
        }
      }

      return back()->with(['success' => true, 'booking' => $booking]);
    }
  }
}
