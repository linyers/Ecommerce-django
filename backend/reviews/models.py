from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_save

User = get_user_model()


class Comment(models.Model):
    comment = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='+')

    @property
    def children(self):
        return Comment.objects.filter(parent=self).order_by('-created_on').all()
    
    @property
    def is_parent(self):
        if self.parent is None:
            return True
        return False


class Review(models.Model):
    body = models.TextField()
    rate = models.DecimalField(max_digits=2, decimal_places=1, validators=[MinValueValidator(1),  MaxValueValidator(100)])
    author = models.ForeignKey(User, related_name="reviews", on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', related_name="reviews", on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, blank=True, related_name='likes')
    dislikes = models.ManyToManyField(User, blank=True, related_name='dislikes')
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)


def set_product_rating(sender, instance, *args, **kwargs):
    reviews_rate = ([r.rate for r in instance.reviews.all()])
    instance.rating = round(sum(reviews_rate) * len(reviews_rate), 1)

post_save.connect(set_product_rating, sender=Review)