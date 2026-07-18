from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'satisfaction_display', 'created_at')
    list_filter = ('satisfaction',)
    search_fields = ('name', 'email', 'message')

    @admin.display(description='Satisfaction')
    def satisfaction_display(self, obj):
        if obj.satisfaction is None:
            return 'Not analyzed'
        return 'Satisfied' if obj.satisfaction == 1 else 'Not satisfied'
