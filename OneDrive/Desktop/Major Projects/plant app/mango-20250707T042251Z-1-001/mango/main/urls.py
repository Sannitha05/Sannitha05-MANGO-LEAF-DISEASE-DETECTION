from django.urls import path
from . import views

urlpatterns = [
   path('api/predict/',views.predict_api, name="index"),
   path('api/history/', views.prediction_history, name='prediction_history'),
   path('api/history/delete/<int:entry_id>/', views.delete_history_by_id, name='delete_history_by_id'),
]