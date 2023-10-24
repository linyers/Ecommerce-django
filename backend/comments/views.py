from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Comment
from .serializers import CommentSerializer
from .permissions import IsOwnerOrAdmin


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = [AllowAny,]
        else:
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        data = request.query_params

        try:
            product_id = int(data['product_id'])
        except:
            return Response({'error': 'Enter a valid integer'}, status=status.HTTP_404_NOT_FOUND)
        
        comments = Comment.objects.filter(product__id=product_id, parent=None).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)