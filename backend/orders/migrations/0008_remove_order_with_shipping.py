# Generated by Django 4.2.5 on 2023-10-15 01:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0007_alter_pucharse_order'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='with_shipping',
        ),
    ]
