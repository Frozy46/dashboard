from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now
from .models import Shift, Product, ProductVolume
from .serializers import ShiftSerializer


class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        data = [{'id': product.id, 'name': product.name} for product in products]
        return Response(data, status=status.HTTP_200_OK)


class ProductVolumeListView(APIView):
    def get(self, request, product_id):
        volumes = ProductVolume.objects.filter(product_id=product_id)
        data = [{'id': volume.id, 'volume': str(volume.volume)} for volume in volumes]
        return Response(data, status=status.HTTP_200_OK)


class CurrentShiftView(APIView):
    def get(self, request):
        try:
            shift = Shift.objects.filter(is_active=True).latest('start_time')
            serializer = ShiftSerializer(shift)
            return Response(serializer.data)
        except Shift.DoesNotExist:
            return Response({'error': 'No active shift found.'}, status=status.HTTP_404_NOT_FOUND)


class StartShiftView(APIView):
    def post(self, request):
        serializer = ShiftSerializer(data=request.data)
        if serializer.is_valid():
            shift = serializer.save(start_time=now())
            return Response(ShiftSerializer(shift).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PauseShiftView(APIView):
    def post(self, request, pk):
        try:
            shift = Shift.objects.get(pk=pk)
            shift.is_paused = not shift.is_paused
            shift.save()
            return Response({'status': 'Paused' if shift.is_paused else 'Resumed'})
        except Shift.DoesNotExist:
            return Response({'error': 'Shift not found.'}, status=status.HTTP_404_NOT_FOUND)


class EndShiftView(APIView):
    def post(self, request, pk):
        try:
            shift = Shift.objects.get(pk=pk)
            shift.is_active = False
            shift.save()
            return Response({'status': 'Shift ended successfully.'})
        except Shift.DoesNotExist:
            return Response({'error': 'Shift not found.'}, status=status.HTTP_404_NOT_FOUND)
