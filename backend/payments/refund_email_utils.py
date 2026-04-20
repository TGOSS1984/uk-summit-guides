from django.conf import settings

from core.email_utils import send_plain_email


def send_refund_pending_email(payment) -> int:
    booking = payment.booking

    subject = f"Refund requested: {booking.booking_reference}"

    body = (
        f"Hi {booking.contact_name},\n\n"
        "A refund has now been requested for your cancelled booking.\n\n"
        f"Booking reference: {booking.booking_reference}\n"
        f"Route: {booking.scheduled_tour.route.name}\n"
        f"Region: {booking.scheduled_tour.route.region.name}\n"
        f"Amount: £{payment.amount}\n"
        f"Payment status: Refund pending\n\n"
        "We’ll send another confirmation once Stripe reports the refund as completed.\n\n"
        "UK Summit Guides"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[booking.contact_email],
        fail_silently=False,
    )


def send_refund_completed_email(payment) -> int:
    booking = payment.booking

    subject = f"Refund completed: {booking.booking_reference}"

    body = (
        f"Hi {booking.contact_name},\n\n"
        "Your refund has now been completed.\n\n"
        f"Booking reference: {booking.booking_reference}\n"
        f"Route: {booking.scheduled_tour.route.name}\n"
        f"Region: {booking.scheduled_tour.route.region.name}\n"
        f"Refunded amount: £{payment.amount}\n"
        f"Payment status: Refunded\n\n"
        "Please allow a short period for the funds to appear back in your account, "
        "depending on your bank or card provider.\n\n"
        "UK Summit Guides"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[booking.contact_email],
        fail_silently=False,
    )


def send_refund_notification_email_to_admin(payment, label: str) -> int:
    if not settings.BOOKINGS_NOTIFICATION_EMAIL:
        return 0

    booking = payment.booking

    subject = f"{label}: {booking.booking_reference}"

    body = (
        f"{label}\n\n"
        f"Booking reference: {booking.booking_reference}\n"
        f"Customer: {booking.contact_name}\n"
        f"Customer email: {booking.contact_email}\n"
        f"Route: {booking.scheduled_tour.route.name}\n"
        f"Region: {booking.scheduled_tour.route.region.name}\n"
        f"Amount: £{payment.amount}\n"
        f"Payment status: {payment.status}\n"
        f"Stripe refund id: {payment.stripe_refund_id}\n"
        f"Stripe payment intent: {payment.stripe_payment_intent_id}\n"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[settings.BOOKINGS_NOTIFICATION_EMAIL],
        fail_silently=False,
    )