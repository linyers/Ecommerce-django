from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Review
from .serliazers import ReviewSerializer
from .permissions import IsOwnerOrAdmin


class ReviewsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin,]

    def get(self, request):
        data = request.data

        try:
            product_id = int(data['product_id'])
        except:
            return Response({'error': 'Enter a valid integer'}, status=status.HTTP_404_NOT_FOUND)
        
        if not Review.objects.filter(product__id=product_id).exists():
            return Response({'error': 'No reviews found'}, status=status.HTTP_404_NOT_FOUND)
        
        reviews = Review.objects.filter(product__id=product_id).order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)

    def post(self, request):
        user = request.user
        data = request.data

        serializer = ReviewSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            data = serializer.data
            data['user'] = user
            review = Review.objects.create(**data)
            review.save()
            return Response({'id':review.id, **serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = request.data

        try:
            review = data['id']
            review = Review.objects.get(id=id)
        except:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewSerializer(review, data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        data = request.data

        try:
            review = data['id']
            review = Review.objects.get(pk=id)
        except:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        
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
        
        if not Review.objects.filter(pk=review_id).exists():
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        review = Review.objects.get(pk=review_id)
        
        if review.likes.filter(user=user).exists():
            # if user already liked the review, remove the like
            review.likes.remove(user)
            return Response({'message': 'Like removed'}, status=status.HTTP_200_OK)
        
        if review.dislikes.filter(user=user).exists():
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
        
        if review.dislikes.filter(user=user).exists():
            review.dislikes.remove(user)
            return Response({'message': 'Dislike removed'}, status=status.HTTP_200_OK)
        
        if review.likes.filter(user=user).exists():
            review.likes.remove(user)
            review.dislikes.add(user)
            return Response({'message': 'Dislike added'}, status=status.HTTP_200_OK)
        
        review.dislikes.add(user) 
        return Response({'message': 'Dislike added'}, status=status.HTTP_200_OK)