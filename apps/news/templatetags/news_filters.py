#encoding: utf-8
from django import template
from datetime import datetime
from django.utils.timezone import now as now_func,localtime

register = template.Library()


@register.filter
def time_since(value):

    if not isinstance(value,datetime):
        return value
    now = now_func()
    # timedelay.total_seconds
    timestamp = (now - value).total_seconds()
    if timestamp < 60:
        return 'Just Now'
    elif timestamp >= 60 and timestamp < 60*60:
        minutes = int(timestamp/60)
        return '%s Minutes' % minutes
    elif timestamp >= 60*60 and timestamp < 60*60*24:
        hours = int(timestamp/60/60)
        return '%s Hours' % hours
    elif timestamp >= 60*60*24 and timestamp < 60*60*24*30:
        days = int(timestamp/60/60/24)
        return '%s Days' % days
    else:
        return value.strftime("%Y/%m/%d %H:%M")

@register.filter
def time_format(value):
    if not isinstance(value,datetime):
        return value

    return localtime(value).strftime("%Y/%m/%d %H:%M:%S")