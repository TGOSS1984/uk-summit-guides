from django.conf import settings

from core.email_utils import send_plain_email


def send_payment_confirmation_email(payment) -> int:
    booking = payment.booking
    route = booking.scheduled_tour.route
    region = route.region

    subject = f"Payment received: {booking.booking_reference}"

    body = (
        f"Hi {booking.contact_name},\n\n"
        "We’ve received your payment for your UK Summit Guides booking.\n\n"
        f"Booking reference: {booking.booking_reference}\n"
        f"Route: {route.name}\n"
        f"Region: {region.name}\n"
        f"Departure date: {booking.scheduled_tour.date}\n"
        f"Start time: {booking.scheduled_tour.start_time}\n"
        f"Party size: {booking.party_size}\n"
        f"Amount paid: £{payment.amount}\n"
        f"Payment status: {payment.status.capitalize()}\n\n"
        "Your booking is now confirmed in our system.\n\n"
        "You can review your booking at any time in your account area.\n\n"
        "UK Summit Guides"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[booking.contact_email],
        fail_silently=False,
    )


def send_payment_notification_email_to_admin(payment) -> int:
    if not settings.BOOKINGS_NOTIFICATION_EMAIL:
        return 0

    booking = payment.booking
    route = booking.scheduled_tour.route
    region = route.region

    subject = f"Payment received for booking: {booking.booking_reference}"

    body = (
        "A booking payment has been completed.\n\n"
        f"Booking reference: {booking.booking_reference}\n"
        f"Customer: {booking.contact_name}\n"
        f"Customer email: {booking.contact_email}\n"
        f"Route: {route.name}\n"
        f"Region: {region.name}\n"
        f"Departure date: {booking.scheduled_tour.date}\n"
        f"Start time: {booking.scheduled_tour.start_time}\n"
        f"Party size: {booking.party_size}\n"
        f"Amount paid: £{payment.amount}\n"
        f"Stripe checkout session: {payment.stripe_checkout_session_id}\n"
        f"Stripe payment intent: {payment.stripe_payment_intent_id}\n"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[settings.BOOKINGS_NOTIFICATION_EMAIL],
        fail_silently=False,
    )