from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Comment
from .permissions import IsOwnerOrAdmin


class CommentAPIView(APIView):
    pass