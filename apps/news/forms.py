from django import forms
from apps.forms import FormMixin
from .models import News

class PublicCommentForm(forms.Form,FormMixin):
    content = forms.CharField()
    news_id = forms.IntegerField()

