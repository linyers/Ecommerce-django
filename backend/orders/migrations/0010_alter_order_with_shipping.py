# Generated by Django 4.2.5 on 2023-10-17 02:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0009_order_with_shipping'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='with_shipping',
            field=models.BooleanField(),
        ),
    ]
