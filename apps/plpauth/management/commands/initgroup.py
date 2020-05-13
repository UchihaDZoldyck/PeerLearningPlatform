from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission, ContentType
from apps.course.models import Course
from apps.news.models import News
class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('hello world!'))
        # user_content_types = [
        #     ContentType.objects.get_for_model(News),
        #     ContentType.objects.get_for_model(Course),
        # ]
        # user_permissions = Permission.objects.filter(content_type__in=user_content_types)