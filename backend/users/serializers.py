from rest_framework import serializers

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Address
from .validators import phone_validator, dni_validator, zip_validator
from .utils import send_email

User = get_user_model()


# simple JWT custom serializer 
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        if user.is_active:
            token = super().get_token(user)
            token['username'] = user.username
            token['email'] = user.email
            token['pic'] = str(user.pic)
            return token
        raise serializers.ValidationError({'Email Confirm': 'Please confirm your email address. Note: Check spam!'}) 


# Create user and send email for validate user
class SignupSerializer(serializers.ModelSerializer):
    repeat_password = serializers.CharField(required=True, write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'repeat_password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Delete a repeat password field in the constructor class because otherwise it raise an error
        self.fields.pop('repeat_password')

    def create(self, validated_data):
        user = User.objects.create_user(email=validated_data['email'], username=validated_data['username'], password=validated_data['password'])

        try:
            validate_password(password=validated_data['password'], user=user)
        except ValidationError as err:
            user.delete()
            raise serializers.ValidationError({'password': err.messages})
        
        subject='Activate your user account.'
        msg='confirm your registration:'
        view='activate'
        client_url = settings.CLIENT_URL

        send_email_confirm = send_email(client_url, user, user.email, subject=subject, msg=msg, view=view)
        if send_email_confirm:
            raise serializers.ValidationError({'Email': f'Problem sending email to {user.email}, check if you typed correctly.'})
        
        return user


# For changing password the user must send their email and then a link will arrive to be able to change the password there.
# For send mail with link to change password
class ChangePasswordEmailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('email',)


# For change the password
class ChangePasswordSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    repeat_new_password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ('new_password', 'repeat_new_password')

    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('repeat_new_password'):
            raise serializers.ValidationError({'password': 'passwords do not match'})
        
        return attrs


#serializer, update, delete, get methods
class UserSerializer(serializers.ModelSerializer):
    dni = serializers.CharField(validators=[dni_validator], required=False)
    phone = serializers.CharField(validators=[phone_validator], required=False)
    address = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    def validate(self, attrs):
        first_name = attrs.get('first_name') if attrs.get('first_name') else False
        last_name = attrs.get('last_name') if attrs.get('last_name') else False
        if first_name and not last_name or not first_name and last_name:
            raise serializers.ValidationError({'names': 'Must be a update a two fields.'})
        return super().validate(attrs)

    class Meta:
        model = User
        fields = ('email', 'username', 'pic', 'first_name', 'last_name', 'dni', 'phone', 'created_at', 'address')
        extra_kwargs = {
            'email': {'read_only': True},
            'username': {'read_only': True},
            'created_at': {'read_only': True}
        }


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        extra_kwargs = {
            'zip': {'validators': [zip_validator]}
        }
    
    def validate(self, attrs):
        if Address.objects.filter(user=self.context['request'].user, default=True).exists() and attrs.get('default'):
            raise serializers.ValidationError({'default': 'You already have a default address.'})
        return super().validate(attrs)