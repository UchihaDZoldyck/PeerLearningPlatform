from apps.forms import FormMixin
from django import forms
from apps.news.models import News
from apps.course.models import Course

class EditNewsCategoryForm(forms.Form):
    pk = forms.IntegerField(error_messages={"required": "Id of category must be inputted"})
    name = forms.CharField(max_length=100)


class WriteNewsForm(forms.ModelForm,FormMixin):
    category = forms.IntegerField()
    class Meta:
        model = News
        exclude = ['category','author','pub_time']


class EditNewsForm(forms.ModelForm,FormMixin):
    category = forms.IntegerField()
    pk = forms.IntegerField()
    class Meta:
        model = News
        exclude = ['category','author','pub_time']

class PubCourseForm(forms.ModelForm,FormMixin):
    category_id = forms.IntegerField()
    class Meta:
        model = Course
        exclude = ["category", 'author']