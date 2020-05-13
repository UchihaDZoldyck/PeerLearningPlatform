from django.urls import path, include
from . import  views

app_name = 'news'

urlpatterns = [
    path('<int:news_id>/', views.news_detail, name='news_detail'),
    path('list/', views.news_list, name='news_list'),
    path('public_comment/', views.public_comment, name='public_comment'),
    path('search/', include('haystack.urls')),
    # path('click_like/', views.click_like, name='click_like'),
]