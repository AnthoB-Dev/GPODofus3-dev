from django.urls import path
from .views import sample_data

urlpatterns = [
    path('sample/', sample_data),
]
