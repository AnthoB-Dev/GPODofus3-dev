"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, include
from app.models import LastSession
from app.views import redirect

def redirect_to_guide(request):
    last_session = LastSession.objects.first()
    if last_session is not None:
        return redirect("app:guide_detail", guide_id=last_session.last_guide_id)
    else:
        return redirect("app:guide_detail", guide_id=1)

urlpatterns = [
    path("admin/", admin.site.urls),
    # Redirection de la racine vers /app/
    path("", redirect_to_guide),
    # Routes de l'application
    path("app/", include("app.urls")),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]