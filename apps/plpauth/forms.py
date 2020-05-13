from django import forms
from apps.forms import FormMixin
from django.core.cache import cache
from .models import User

class LoginForm(forms.Form, FormMixin):
    email = forms.CharField(error_messages={"invalid": "Please input correct email"})
    password = forms.CharField(max_length=20, min_length=6, error_messages={"max_length":"Password should be less than 20 characters",
                                                                            "min_length":"Password should be more than 6 characters"})
    remember = forms.IntegerField(required=False)


class RegisterForm(forms.Form,FormMixin):
    email = forms.EmailField(error_messages={"invalid": "Please input correct email"})
    username = forms.CharField(max_length=20)
    password1 = forms.CharField(max_length=20, min_length=6,
                               error_messages={"max_length": "Password should be less than 20 characters", "min_length": "Password should be more than 6 characters"})
    password2 = forms.CharField(max_length=20, min_length=6,
                                error_messages={"max_length": "Password should be less than 20 characters", "min_length": "Password should be more than 6 characters"})
    img_captcha = forms.CharField(min_length=4,max_length=4)
    sms_captcha = forms.CharField(min_length=4,max_length=4)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()

        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')

        if password1 != password2:
            raise forms.ValidationError("2 passwords are different!")

        img_captcha = cleaned_data.get('img_captcha')
        cached_img_captcha = cache.get(img_captcha.lower())
        if not cached_img_captcha or cached_img_captcha.lower() != img_captcha.lower():
            raise forms.ValidationError("Graph validation not correct")

        email = cleaned_data.get('email')
        sms_captcha = cleaned_data.get('sms_captcha')
        cached_sms_captcha = cache.get(email)

        if not cached_sms_captcha or cached_sms_captcha.lower() != sms_captcha.lower():
            raise forms.ValidationError("Email validation not correct")

        exists = User.objects.filter(email=email).exists()
        if exists:
            forms.ValidationError("This email has been registered")

        return cleaned_data