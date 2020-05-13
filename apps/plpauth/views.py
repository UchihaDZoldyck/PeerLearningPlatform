from django.contrib.auth import login, logout, authenticate
from django.core.mail import send_mail
from django.views.decorators.http import require_POST

from peer_learning_platform import settings
from .forms import LoginForm, RegisterForm
from django.http import JsonResponse
from utils import restful
from django.shortcuts import redirect,reverse
from utils.captcha.plpcaptcha import Captcha
from io import BytesIO
from django.http import HttpResponse
from django.core.cache import cache
from django.contrib.auth import get_user_model
User = get_user_model()

@require_POST
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        email = form.cleaned_data.get('email')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, username=email, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth(message="Fronzen account!")
        else:
            return restful.params_error(message="Wrong email or password!")
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)


def logout_view(request):
    logout(request)
    return redirect(reverse('index'))


@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        email = form.cleaned_data.get('email')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = User.objects.create_user(email=email,username=username,password=password)
        login(request,user)
        return restful.ok()
    else:
        print(form.get_errors())
        return restful.params_error(message=form.get_errors())



def img_captcha(request):
    text,image = Captcha.gene_code()
    out = BytesIO()
    image.save(out,'png')
    # The pointer of BytesIO moves to the beginning position
    out.seek(0)

    response = HttpResponse(content_type='image/png')
    response.write(out.read())
    response['Content-length'] = out.tell()
    cache.set(text.lower(), text.lower(),5*60)

    return response

def sms_captcha(request):
    email = request.GET.get('email')
    code = Captcha.gene_text()
    cache.set(email,code,5*60)
    subject = "Yo man this is plp subject"
    message = "Welcome to plp. This is a message " + code
    result = send_mail(subject=subject, message=message, from_email=settings.EMAIL_HOST_USER, recipient_list=[email],  fail_silently=False)
    print(result)
    return restful.ok()


def cache_test(request):
    cache.set('username','Uchiha',60)
    result = cache.get('username')
    print(result)
    return HttpResponse('success')