export const djangoTemplate = {
  files: {
    "/manage.py": `#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
`,
    "/myproject/settings.py": `"""
Django settings for myproject project.
This is a simplified configuration for educational purposes.
"""

from pathlib import Path

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-example-key-for-learning'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'myapp',  # Your app
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
`,
    "/myproject/urls.py": `"""
URL configuration for myproject project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('myapp.urls')),
]
`,
    "/myapp/models.py": `from django.db import models

class ExampleModel(models.Model):
    """
    Example Django model.
    
    This demonstrates how to define database models in Django.
    """
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Example'
        verbose_name_plural = 'Examples'
    
    def __str__(self):
        return self.name
`,
    "/myapp/views.py": `from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ExampleModel
from .serializers import ExampleSerializer

@api_view(['GET'])
def example_api_view(request):
    """
    Example API endpoint using Django REST Framework.
    
    Returns a simple JSON response.
    """
    data = {
        'message': 'Hello from Django!',
        'status': 'success'
    }
    return Response(data)

class ExampleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on ExampleModel.
    
    Provides: list, create, retrieve, update, delete
    """
    queryset = ExampleModel.objects.all()
    serializer_class = ExampleSerializer
`,
    "/myapp/serializers.py": `from rest_framework import serializers
from .models import ExampleModel

class ExampleSerializer(serializers.ModelSerializer):
    """
    Serializer for ExampleModel.
    
    Converts model instances to/from JSON.
    """
    class Meta:
        model = ExampleModel
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'is_active']
        read_only_fields = ['created_at', 'updated_at']
`,
    "/myapp/urls.py": `from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'examples', views.ExampleViewSet)

urlpatterns = [
    path('hello/', views.example_api_view, name='hello'),
    path('', include(router.urls)),
]
`,
    "/requirements.txt": `Django>=4.2.0
djangorestframework>=3.14.0
`,
    "/README.md": `# Django REST API Project

This is an educational Django project demonstrating:
- Django models and ORM
- Django REST Framework
- API endpoints and ViewSets
- Serializers
- URL routing

## Project Structure

\`\`\`
myproject/
├── manage.py           # Django management script
├── myproject/          # Project configuration
│   ├── settings.py     # Project settings
│   └── urls.py         # Root URL configuration
└── myapp/              # Application
    ├── models.py       # Database models
    ├── views.py        # API views and logic
    ├── serializers.py  # DRF serializers
    └── urls.py         # App URL patterns
\`\`\`

## To Run Locally

\`\`\`bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
\`\`\`

Visit http://localhost:8000/api/
`,
  },
  dependencies: ["Django>=4.2.0", "djangorestframework>=3.14.0"],
  description:
    "Complete Django REST API project with models, views, serializers, and URL routing",
};

export const djangoExerciseStarter = `# Django Exercise: Create a Blog API

# TODO: Complete the following tasks:
# 1. Create a BlogPost model with title, content, author, created_at
# 2. Create a serializer for BlogPost
# 3. Create a ViewSet for CRUD operations
# 4. Register the URL route

# Your code here:
`;
