from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models.signals import pre_delete

User = get_user_model()


class Comment(models.Model):
    comment = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, related_name='+')
    created_at = models.DateTimeField(default=timezone.now)

    def children(self):
        return Comment.objects.filter(parent=self).all()
    
    @property
    def is_parent(self):
        if self.parent is None:
            return True
        return False


def delete_parent(sender, instance, **kwargs):
    if instance.children():
        for child in instance.children():
            child.parent = instance.parent
            child.save()


pre_delete.connect(delete_parent, sender=Comment)