from rest_framework import generics, status
from rest_framework.response import Response

from .email_utils import (
    send_contact_acknowledgement_email,
    send_contact_notification_email_to_admin,
)
from .models import ContactMessage
from .serializers import ContactMessageCreateSerializer, ContactMessageSerializer


class ContactMessageCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()

        send_contact_acknowledgement_email(message)
        send_contact_notification_email_to_admin(message)

        output_serializer = ContactMessageSerializer(message)
        headers = self.get_success_headers(output_serializer.data)
        return Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )