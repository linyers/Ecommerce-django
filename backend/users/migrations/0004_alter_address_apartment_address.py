# Generated by Django 4.2.5 on 2023-10-11 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_address_apartment_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='apartment_address',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
