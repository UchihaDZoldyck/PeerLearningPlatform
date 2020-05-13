from django.shortcuts import render
from django.http import Http404
from .models import Course


def course_index(request):
    context = {
        'courses': Course.objects.all()
    }
    return render(request, 'course/course_index.html', context=context)

def course_detail(request, course_id):
    try:
        course = Course.objects.get(pk=course_id)
        context = {
            'course': course
        }
        return render(request, 'course/course_detail.html', context=context)
    except Course.DoesNotExist:
        raise Http404