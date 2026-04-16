from rest_framework import serializers


class CreateCheckoutSessionSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField(min_value=1)