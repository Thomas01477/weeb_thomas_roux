from django.conf import settings
from django.contrib import admin


def each_context(self, request):
    context = admin.AdminSite.each_context(self, request)
    context['site_url'] = settings.FRONTEND_URL
    return context


# Patched onto the default admin site instead of registering a custom
# AdminSite so every app's existing `@admin.register(...)` calls keep working.
admin.site.each_context = each_context.__get__(admin.site, admin.AdminSite)
