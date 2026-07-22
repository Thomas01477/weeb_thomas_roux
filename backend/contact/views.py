import csv
import threading

import sentry_sdk
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotAuthenticated, PermissionDenied
from rest_framework.response import Response

from .models import ContactMessage
from .serializers import ContactMessageSerializer


@api_view(['GET', 'POST'])
def contact_list(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            raise NotAuthenticated()
        if not request.user.is_staff:
            raise PermissionDenied('Only admins can view contact messages.')

        messages = ContactMessage.objects.all().order_by('-created_at')
        serializer = ContactMessageSerializer(messages, many=True)
        return Response(serializer.data)

    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.save()
        _run_in_background(_analyze_satisfaction, message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _run_in_background(target, *args):
    """Run target in a separate thread so the caller (the HTTP response) never
    waits on it; the sentiment model load + inference can take long enough to
    be noticeable otherwise."""
    threading.Thread(target=target, args=args, daemon=True).start()


def _analyze_satisfaction(message):
    """Run the sentiment model on the message; leave satisfaction unset and
    report to Sentry if it is unavailable or fails."""
    try:
        from .ml_utils import predict
        message.satisfaction = predict(message.message)
        message.save(update_fields=['satisfaction'])
    except Exception as error:
        sentry_sdk.capture_exception(error)


@api_view(['GET'])
def export_contact_csv(request):
    if not request.user.is_authenticated:
        raise NotAuthenticated()
    if not request.user.is_staff:
        raise PermissionDenied('Only admins can export contact messages.')

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="contacts.csv"'
    writer = csv.writer(response)
    writer.writerow(['id', 'name', 'email', 'message', 'created_at', 'satisfaction'])
    for message in ContactMessage.objects.all().order_by('-created_at'):
        writer.writerow([
            message.id,
            message.name,
            message.email,
            message.message,
            message.created_at,
            message.satisfaction,
        ])
    return response
