from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

def health(request):
    return JsonResponse({"status": "ok"})

@api_view(["GET"])
def api_root(request):
    return Response({
        "health": reverse("health", request=request),
        "lines": reverse("line-list", request=request),
        "stations": reverse("station-list", request=request),
        "auth": {
            "register": reverse("register", request=request),
            "login": reverse("login", request=request),
            "logout": reverse("logout", request=request),
        }
    })

