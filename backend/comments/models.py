from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Comment(models.Model):
    comment = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='+')
    created_at = models.DateTimeField(auto_now_add=True)

    def children(self):
        return Comment.objects.filter(parent=self).all()
    
    @property
    def is_parent(self):
        if self.parent is None:
            return True
        return False