from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskAPIView, TaskDetailAPIView, TimesheetCalculateDaysAPIView


urlpatterns = [
    
    path('tasks/', TaskAPIView.as_view(),name='tasks'),
    path('tasks/<int:pk>/', TaskDetailAPIView.as_view(), name='task-detail'),  # Обновление и удаление задач
    path('tasks/timesheet-calculate-days/', TimesheetCalculateDaysAPIView.as_view(), name='timesheet-calculate-days'),
    
]
