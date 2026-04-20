from django.conf import settings

from core.email_utils import send_plain_email


def send_booking_cancelled_email(booking) -> int:
    subject = f"Booking cancelled: {booking.booking_reference}"

    body = (
        f"Hi {booking.contact_name},\n\n"
        "Your booking has now been cancelled.\n\n"
        f"Booking reference: {booking.booking_reference}\n"
        f"Route: {booking.scheduled_tour.route.name}\n"
        f"Region: {booking.scheduled_tour.route.region.name}\n"
        f"Departure date: {booking.scheduled_tour.date}\n"
        f"Start time: {booking.scheduled_tour.start_time}\n"
        f"Party size: {booking.party_size}\n"
        f"Booking status: {booking.status.capitalize()}\n\n"
        "If payment had already been taken, refund processing may now be underway. "
        "You will receive another confirmation when refund status is updated.\n\n"
        "UK Summit Guides"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[booking.contact_email],
        fail_silently=False,
    )


def send_booking_cancelled_notification_email_to_admin(booking) -> int:
    if not settings.BOOKINGS_NOTIFICATION_EMAIL:
        return 0

    subject = f"Booking cancelled: {booking.booking_reference}"

    body = (
        "A booking has been cancelled.\n\n"
        f"Booking reference: {booking.booking_reference}\n"
        f"Customer: {booking.contact_name}\n"
        f"Customer email: {booking.contact_email}\n"
        f"Route: {booking.scheduled_tour.route.name}\n"
        f"Region: {booking.scheduled_tour.route.region.name}\n"
        f"Departure date: {booking.scheduled_tour.date}\n"
        f"Start time: {booking.scheduled_tour.start_time}\n"
        f"Party size: {booking.party_size}\n"
        f"Booking status: {booking.status}\n"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[settings.BOOKINGS_NOTIFICATION_EMAIL],
        fail_silently=False,
    )