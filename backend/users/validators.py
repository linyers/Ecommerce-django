from rest_framework.validators import ValidationError
import re

def phone_validator(phone):
    phone_regex = re.compile(r'^\+?1?\d{9,15}$')
    if not phone_regex.match(phone):
        raise ValidationError({"phone": "Invalid phone number."})
    return phone

def dni_validator(dni):
    dni_regex = re.compile(r'^\d{7,8}$')
    if not dni_regex.match(dni):
        raise ValidationError({"dni": "Invalid dni number."})
    return dni

def zip_validator(zip):
    zip_regex = re.compile(r'^\d{4,5}(?:[-\s]\d{4})?$')
    if not zip_regex.match(zip):
        raise ValidationError({"zip": "Invalid zip number."})
    return zip
