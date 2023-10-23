# Generated by Django 4.2.5 on 2023-10-19 23:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orders', '0014_alter_order_order_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_status',
            field=models.CharField(choices=[('on_the_way', 'On the way'), ('delivered', 'Delivered'), ('pending_refund', 'Pending refund'), ('refunded', 'Refunded')], default='pending', max_length=50),
        ),
        migrations.AlterField(
            model_name='refund',
            name='costumer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='refund', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='refund',
            name='order',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='refund', to='orders.order'),
        ),
    ]
