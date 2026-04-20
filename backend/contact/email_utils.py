from django.conf import settings

from core.email_utils import send_plain_email


def send_contact_acknowledgement_email(contact_message) -> int:
    subject = f"We've received your message: {contact_message.subject}"

    body = (
        f"Hi {contact_message.name},\n\n"
        "Thanks for getting in touch with UK Summit Guides.\n\n"
        "We’ve received your message and will review it as soon as possible.\n\n"
        f"Subject: {contact_message.subject}\n"
        f"Message received: {contact_message.created_at:%d/%m/%Y %H:%M}\n\n"
        "Your message:\n"
        f"{contact_message.message}\n\n"
        "We’ll respond using the email address you provided.\n\n"
        "UK Summit Guides"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[contact_message.email],
        fail_silently=False,
    )


def send_contact_notification_email_to_admin(contact_message) -> int:
    if not settings.CONTACT_NOTIFICATION_EMAIL:
        return 0

    subject = f"New contact message: {contact_message.subject}"

    body = (
        "A new contact form message has been received.\n\n"
        f"Name: {contact_message.name}\n"
        f"Email: {contact_message.email}\n"
        f"Subject: {contact_message.subject}\n"
        f"Created: {contact_message.created_at:%d/%m/%Y %H:%M}\n\n"
        "Message:\n"
        f"{contact_message.message}\n"
    )

    return send_plain_email(
        subject=subject,
        body=body,
        recipients=[settings.CONTACT_NOTIFICATION_EMAIL],
        fail_silently=False,
    )