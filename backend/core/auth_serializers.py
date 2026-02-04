from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ("email", "password")
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ovaj email je vec registrovan.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value
    
    def create(self, validated_data):
        email = validated_data["email"].lower().strip()
        user = User.objects.create_user(
            username = email,
            email = email,
            password = validated_data["password"],
        )
        return user
    
    
    