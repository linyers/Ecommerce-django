from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from products.models import Product
from .models import Review
from .serliazers import ReviewSerializer
from .permissions import IsOwnerOrAdmin


class ReviewsAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET' or self.request.method == 'OPTIONS':
            permission_classes = [AllowAny,]
        elif self.request.method == 'POST':
            permission_classes = [IsAuthenticated,]
        else:
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin,]
        return [permission() for permission in permission_classes]
    
    def get(self, request, *args, **kwargs):
        data = request.query_params

        try:
            product_id = int(data['product_id'])
        except:
            return Response({'error': 'Enter a valid integer'}, status=status.HTTP_404_NOT_FOUND)
        
        reviews = Review.objects.filter(product__id=product_id).order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)

    def post(self, request):
        user = request.user
        data = request.data

        self.check_object_permissions(request, user)

        serializer = ReviewSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            data = serializer.data
            data['author'] = user
            data['product'] = Product.objects.get(pk=data['product'])
            review = Review.objects.create(**data)
            review.save()
            return Response({'id':review.id, **serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = request.data

        try:
            id = data['id']
            review = Review.objects.get(id=id)
            data['product'] = review.product.pk
        except:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, review)

        serializer = ReviewSerializer(review, data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        data = request.data

        try:
            id = data['id']
            review = Review.objects.get(pk=id)
        except:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, review)

        review.delete()
        return Response({'message': 'Review deleted'}, status=status.HTTP_200_OK)


class ReviewLikeAPIView(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        user = request.user
        data = request.data

        try:
            review_id = int(data['review_id'])
        except:
            return Response({'error': 'Enter a valid integer'}, status=status.HTTP_404_NOT_FOUND)
        
        if not Review.objects.filter(id=review_id).exists():
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        review = Review.objects.get(pk=review_id)
        
        if Review.objects.filter(pk=review_id, likes=user).exists():
            # if user already liked the review, remove the like
            review.likes.remove(user)
            return Response({'message': 'Like removed'}, status=status.HTTP_200_OK)
        
        if Review.objects.filter(pk=review_id, dislikes=user).exists():
            # if user already disliked the review, remove the dislike and add a like
            review.dislikes.remove(user)
            review.likes.add(user)
            return Response({'message': 'Like added'}, status=status.HTTP_200_OK)
        
        review.likes.add(user) 
        # finally if user dont like or dislike the review, set like
        return Response({'message': 'Like added'}, status=status.HTTP_200_OK)


class ReviewDislikeAPIView(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        """
        The same logic as ReviewLikeAPIView only change the review.likes to review.dislikes
        """
        user = request.user
        data = request.data

        try:
            review_id = int(data['review_id'])
        except:
            return Response({'error': 'Enter a valid integer'}, status=status.HTTP_404_NOT_FOUND)
        
        if not Review.objects.filter(pk=review_id).exists():
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        review = Review.objects.get(pk=review_id)
        
        if Review.objects.filter(pk=review_id, dislikes=user).exists():
            review.dislikes.remove(user)
            return Response({'message': 'Dislike removed'}, status=status.HTTP_200_OK)
        
        if Review.objects.filter(pk=review_id, likes=user).exists():
            review.likes.remove(user)
            review.dislikes.add(user)
            return Response({'message': 'Dislike added'}, status=status.HTTP_200_OK)
        
        review.dislikes.add(user) 
        return Response({'message': 'Dislike added'}, status=status.HTTP_200_OK)