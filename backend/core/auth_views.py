from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .auth_serializers import RegisterSerializer

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
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"detail": "username and password are required"},
            status = status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username = username, password = password)
    if user is None:
        return Response({"detail": "invalid credentials"}, status = status.HTTP_401_UNAUTHORIZED )

    token, _ = Token.objects.get_or_create(user = user)
    return Response({"message": "logged_in", "token": token.key, "username": username}, status = status.HTTP_200_OK,) 

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def logout(request):

    if request.method == "GET":
        return Response({"detail":"Send post to this endpoint to logout (token will be deleted)."}, status = status.HTTP_200_OK)

    request.user.auth_token.delete()
    return Response({"message": "logged_out"}, status = status.HTTP_200_OK)
