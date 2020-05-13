from django.shortcuts import render
from apps.news.models import NewsCategory
from apps.course.models import Course
from django.views.generic import View
from .forms import PubCourseForm
from utils import restful

class PubCourse(View):
    def get(self,request):
        context = {
            'categories': NewsCategory.objects.all(),
        }
        return render(request,'cms/pub_course.html',context=context)

    def post(self,request):
        form = PubCourseForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data.get('title')
            category_id = form.cleaned_data.get('category_id')
            video_url = form.cleaned_data.get('video_url')
            cover_url = form.cleaned_data.get("cover_url")
            duration = form.cleaned_data.get('duration')
            profile = form.cleaned_data.get('profile')

            category = NewsCategory.objects.get(pk=category_id)

            Course.objects.create(title=title, video_url=video_url, cover_url=cover_url, duration=duration,
                                  profile=profile, category=category, author=request.user)
            return restful.ok()
        else:
            return restful.params_error(message=form.get_errors())