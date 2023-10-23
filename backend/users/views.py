from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.conf import settings

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.serializers import ValidationError

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .permissions import IsOwnerOrAdmin
from .models import Address
from .serializers import UserSerializer, AddressSerializer, MyTokenObtainPairSerializer, SignupSerializer, ChangePasswordEmailSerializer, ChangePasswordSerializer
from .utils import account_activation_token, password_reset_token, send_email


class UserView(APIView):
    permission_classes = [IsAuthenticated,]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return Response({'success': 'Goodbye...'}, status=status.HTTP_200_OK)


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin,]

    def list(self, request, *args, **kwargs):
        user = request.user
        queryset = Address.objects.all().filter(user=user)
        serializer = AddressSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        user = request.user
        data = {'user': user.pk, **request.data}
        serializer = AddressSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            data = serializer.data
            data['user'] = user
            address = Address.objects.create(**data)
            address.save()
            return Response({'id':address.id, **serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class SignupAPIView(CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [AllowAny,]

    def post(self, request, *args, **kwargs):
        try:
            if request.data['password'] != request.data['repeat_password']:
                raise ValidationError({'password': 'passwords do not match.'})
        except KeyError as err:
            raise ValidationError({str(err).replace("'", ""): 'enter a valid value.'})
        
        serializer = SignupSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=200, data={'success': 'Check your email. Note: Check spam'})


def get_user_with_token(uidb64):
    User = get_user_model()

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except:
        user = None

    return user


def activate(request, uidb64, token):
    user = get_user_with_token(uidb64)

    if user and not user.is_active and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()

        return JsonResponse({"Success": "Thank you for your email confirmation. Now you can login your account."}, status=200)
    else:
        return JsonResponse({"Error": "Activation link is invalid!"}, status=404)


class ChangePasswordEmailView(CreateAPIView):
    serializer_class = ChangePasswordEmailSerializer
    permission_classes = [AllowAny,]

    def post(self, request, *args, **kwargs):
        User = get_user_model()

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = request.data.get('email')

        if not User.objects.filter(email=email).exists():
            raise ValidationError({'Email': f'This email {email} is not registered.'})
        user = User.objects.get(email=email)

        subject='Change your password'
        msg='change your password:'
        view='change-password'
        client_url = settings.CLIENT_URL

        send_email_confirm = send_email(client_url, user, user.email, subject=subject, msg=msg, view=view)
        if send_email_confirm:
            raise ValidationError({'Email': f'Problem sending email to {email}, check if you typed correctly.'})

        return Response(status=200, data={'Success': 'Check your email to change your password!'})


class ChangePasswordView(CreateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [AllowAny,]

    def post(self, request, *args, **kwargs):
        user = get_user_with_token(kwargs['uidb64'])

        if user and password_reset_token.check_token(user, kwargs['token']):
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)

            user.set_password(request.data.get('new_password'))
            user.save()

            return JsonResponse({"Success": "Password changed!. Now you can login your account."})
        else:
            return JsonResponse({"Error": "Activation link is invalid!"}, status=404)