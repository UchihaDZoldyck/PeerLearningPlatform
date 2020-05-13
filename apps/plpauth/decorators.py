from utils import restful
from django.shortcuts import redirect

def plp_login_required(func):
    def wrapper(request,*args,**kwargs):
        if request.user.is_authenticated:
            return func(request,*args,**kwargs)
        else:
            if request.is_ajax():
                return restful.unauth(message='Please log in first!')
            else:
                return redirect('/')
    return wrapper