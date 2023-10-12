from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMessage
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six


def send_email(client_url, user, to_email, **kwargs):
    mail_subject = kwargs['subject']
    message = render_to_string('email_message.html', {
        'email': user.email,
        'msg': kwargs['msg'],
        'client_url': client_url,
        'view': kwargs['view'],
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user) if kwargs['view'] == 'activate' else password_reset_token.make_token(user),
        # 'domain': get_current_site(request).domain,
        # 'protocol': 'https' if request.is_secure() else 'http',
    })
    email = EmailMessage(mail_subject, message, to=[to_email])

    if not email.send():
        return True
    return False


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk) + six.text_type(timestamp) + six.text_type(user.get_username)
        )
account_activation_token = AccountActivationTokenGenerator()

password_reset_token = PasswordResetTokenGenerator()