from django.urls import path
from .views import CurrentShiftView, StartShiftView, PauseShiftView, EndShiftView, ProductListView, \
    ProductVolumeListView, UpdateShiftTime

urlpatterns = [
    path('current/', CurrentShiftView.as_view(), name='current-shift'),
    path('update_time/', UpdateShiftTime.as_view(), name='update-time'),
    path('start/', StartShiftView.as_view(), name='start-shift'),
    path('<int:pk>/pause/', PauseShiftView.as_view(), name='pause-shift'),
    path('<int:pk>/end/', EndShiftView.as_view(), name='end-shift'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:product_id>/volumes', ProductVolumeListView.as_view(), name='product-list'),
]
