from rest_framework import serializers
from .models import Shift, Product, ProductVolume


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class VolumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVolume
        fields = '__all__'


class ShiftSerializer(serializers.ModelSerializer):
    percentage_completed = serializers.ReadOnlyField()
    product = ProductSerializer(read_only=True)
    volume = VolumeSerializer(read_only=True)

    class Meta:
        model = Shift
        fields = '__all__'
