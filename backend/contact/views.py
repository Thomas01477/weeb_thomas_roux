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
        _analyze_satisfaction(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _analyze_satisfaction(message):
    """Run the sentiment model on the message; leave satisfaction unset if it is unavailable."""
    try:
        from .ml_utils import predict
        message.satisfaction = predict(message.message)
        message.save(update_fields=['satisfaction'])
    except Exception:
        pass
