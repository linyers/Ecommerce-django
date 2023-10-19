# Generated by Django 4.2.5 on 2023-10-19 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0013_remove_shipping_deliverer_remove_shipping_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_status',
            field=models.CharField(choices=[('on_the_way', 'On the way'), ('delivered', 'Delivered'), ('refunded', 'Refunded')], default='pending', max_length=50),
        ),
    ]
