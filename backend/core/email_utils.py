from typing import Iterable

from django.conf import settings
from django.core.mail import send_mail


def send_plain_email(
    *,
    subject: str,
    body: str,
    recipients: Iterable[str],
    fail_silently: bool = False,
) -> int:
    recipient_list = [email for email in recipients if email]

    if not recipient_list:
        return 0

    return send_mail(
        subject=subject,
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipient_list,
        fail_silently=fail_silently,
    )