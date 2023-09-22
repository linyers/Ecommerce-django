# Generated by Django 4.2.5 on 2023-09-22 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_status',
            field=models.CharField(choices=[('pending', 'Pending'), ('cancelled', 'Cancelled'), ('confirm', 'Confirm'), ('on_the_way', 'On the way'), ('delivered', 'Delivered'), ('refunded', 'Refunded')], default='pending', max_length=50),
        ),
    ]