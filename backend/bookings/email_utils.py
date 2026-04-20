from django.conf import settings

from core.email_utils import send_plain_email


def send_booking_confirmation_email(booking) -> int:
    route_name = booking.scheduled_tour.route.name
    region_name = booking.scheduled_tour.route.region.name
    tour_date = booking.scheduled_tour.date
    tour_time = booking.scheduled_tour.start_time

    subject = f"Booking confirmed: {booking.booking_reference}"

    body = (
        f"Hi {booking.contact_name},\n\n"
        "Thanks for booking with UK Summit Guides.\n\n"
        "Your booking has been created successfully.\n\n"
        f"Booking reference: {booking.booking_reference}\n"
        f"Route: {route_name}\n"
        f"Region: {region_name}\n"
        f"Departure date: {tour_date}\n"
        f"Start time: {tour_time}\n"
        f"Party size: {booking.party_size}\n"
        f"Total price: £{booking.total_price}\n\n"
        "Contact details provided:\n"
        f"Name: {booking.contact_name}\n"
        f"Email: {booking.contact_email}\n"
        f"Phone: {booking.contact_phone}\n"
        f"Emergency contact: {booking.emergency_contact or 'Not provided'}\n\n"
        f"Notes: {booking.notes or 'None'}\n\n"
        "This email confirms that your booking is now in our system. "
        "Payment and further booking management can be handled through your account area.\n\n"
        "UK Summit Guides"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[booking.contact_email],
        fail_silently=False,
    )


def send_booking_notification_email_to_admin(booking) -> int:
    if not settings.BOOKINGS_NOTIFICATION_EMAIL:
        return 0

    subject = f"New booking received: {booking.booking_reference}"

    body = (
        "A new booking has been created.\n\n"
        f"Booking reference: {booking.booking_reference}\n"
        f"Customer: {booking.contact_name}\n"
        f"Email: {booking.contact_email}\n"
        f"Route: {booking.scheduled_tour.route.name}\n"
        f"Region: {booking.scheduled_tour.route.region.name}\n"
        f"Departure date: {booking.scheduled_tour.date}\n"
        f"Start time: {booking.scheduled_tour.start_time}\n"
        f"Party size: {booking.party_size}\n"
        f"Total price: £{booking.total_price}\n"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[settings.BOOKINGS_NOTIFICATION_EMAIL],
        fail_silently=False,
    )