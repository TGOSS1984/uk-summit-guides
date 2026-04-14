from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("subject", "name", "email", "resolved", "created_at")
    list_filter = ("resolved", "created_at")
    search_fields = ("subject", "name", "email", "message")