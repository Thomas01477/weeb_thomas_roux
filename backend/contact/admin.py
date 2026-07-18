import csv

from django.contrib import admin
from django.http import HttpResponse

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'satisfaction_display', 'created_at')
    list_filter = ('satisfaction',)
    search_fields = ('name', 'email', 'message')
    actions = ['export_as_csv']

    @admin.display(description='Satisfaction')
    def satisfaction_display(self, obj):
        if obj.satisfaction is None:
            return 'Not analyzed'
        return 'Satisfied' if obj.satisfaction == 1 else 'Not satisfied'

    @admin.action(description='Export selected messages as CSV')
    def export_as_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="contacts.csv"'
        writer = csv.writer(response)
        writer.writerow(['id', 'name', 'email', 'message', 'created_at', 'satisfaction'])
        for message in queryset.order_by('-created_at'):
            writer.writerow([
                message.id,
                message.name,
                message.email,
                message.message,
                message.created_at,
                message.satisfaction,
            ])
        return response
