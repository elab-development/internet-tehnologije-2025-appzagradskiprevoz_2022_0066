from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .auth_serializers import RegisterSerializer
from django.contrib.auth import logout as django_logout

@api_view(["POST"])
@permission_classes([AllowAny])

def register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user = serializer.save()
    token, _ = Token.objects.get_or_create(user = user)

    return Response(
        {"message": "registered", "token": token.key, "username": user.username},
        status = status.HTTP_201_CREATED,
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"detail": "email and password are required"},
            status = status.HTTP_400_BAD_REQUEST,
        )

    email = email.lower().strip()

    user = authenticate(username = email, password = password)
    if user is None:
        return Response({"detail": "Pogresan email ili password"}, status = status.HTTP_401_UNAUTHORIZED )

    token, _ = Token.objects.get_or_create(user = user)
    return Response({"message": "logged_in", "token": token.key, "email": email}, status = status.HTTP_200_OK,) 

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def logout(request):

    if request.method == "GET":
        return Response({"detail":"Send post to this endpoint to logout (token will be deleted)."}, status = status.HTTP_200_OK)

    request.user.auth_token.delete()
    django_logout(request)
    return Response({"message": "logged_out"}, status = status.HTTP_200_OK)
