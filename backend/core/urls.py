from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .api import LineViewSet, StationViewSet
from .auth_views import register, login, logout

router = DefaultRouter()
router.include_root_view = False

router.register(r"lines", LineViewSet, basename = "line")
router.register(r"stations", StationViewSet, basename = "station")

urlpatterns = [
    path("health/", views.health, name="health"),
    path("auth/register/", register, name="register"),
    path("auth/login/", login, name="login"),
    path("auth/logout/", logout, name="logout"),
    path("", views.api_root, name = "api-root"),

    path("", include(router.urls)), 
]



