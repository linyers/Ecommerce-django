from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    parent_username = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'comment', 'author', 'product', 'parent', 'parent_username', 'created_at', 'replies')

    def get_author(self, obj):
        return obj.author.username
    
    def get_replies(self, obj):
        return CommentSerializer(obj.children(), many=True).data
    
    def get_parent_username(self, obj):
        if obj.parent:
            return obj.parent.author.username
        return None
    
    def create(self, validated_data):
        user = self.context['request'].user
        comment = Comment.objects.create(author=user, **validated_data)
        return comment
    
    def update(self, instance, validated_data):
        commnet_data = validated_data.pop('comment')
        instance.comment = commnet_data
        instance.save()
        return instance