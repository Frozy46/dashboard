from django.db import models
from django.utils.timezone import now


class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class ProductVolume(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='volumes')
    volume = models.DecimalField(max_digits=20, decimal_places=2)

    class Meta:
        unique_together = ('product', 'volume')
        ordering = ['product', 'volume']

    def __str__(self):
        return f"{self.product.name} - {self.volume} л"


class Shift(models.Model):
    name = models.CharField(max_length=100)

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    volume = models.ForeignKey(ProductVolume, on_delete=models.CASCADE)

    goal = models.PositiveIntegerField()
    current_result = models.PositiveIntegerField(default=0)

    start_time = models.DateTimeField(default=now)

    is_active = models.BooleanField(default=True)
    is_paused = models.BooleanField(default=False)

    countdown_time = models.PositiveIntegerField(null=True, blank=True)  # В секундах
    remaining_time = models.PositiveIntegerField(null=True, blank=True)  # В секундах
    open_ended = models.BooleanField(default=False)  # True: таймер, False: отсчет

    @property
    def percentage_completed(self):
        if self.goal > 0:
            return round((self.current_result / self.goal) * 100, 2)
        return 0

    def __str__(self):
        return self.name
