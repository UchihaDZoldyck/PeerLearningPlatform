#encoding: utf-8

from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey('news.NewsCategory',on_delete=models.SET_NULL,null=True)
    author = models.ForeignKey('plpauth.User',on_delete=models.SET_NULL,null=True)
    video_url = models.URLField()
    cover_url = models.URLField()
    duration = models.IntegerField()
    profile = models.TextField()
    pub_time = models.DateTimeField(auto_now_add=True)