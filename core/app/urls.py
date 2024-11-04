from django.urls import path
from . import views
# from .views import CharacterListView

urlpatterns = [
    path("", views.DebugView, name="debug_view"),
]