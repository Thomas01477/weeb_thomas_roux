from django.urls import path

from . import views

urlpatterns = [
    path('contact/', views.contact_list, name='contact-list'),
    path('contact/export/', views.export_contact_csv, name='contact-export'),
]
