from rest_framework import serializers
from .models import Shift

class ShiftSerializer(serializers.ModelSerializer):
    percentage_completed = serializers.ReadOnlyField()

    class Meta:
        model = Shift
        fields = '__all__'
