# Generated by Django 4.2.5 on 2023-10-24 15:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0003_comment_updated_at_alter_comment_created_at_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='updated_at',
        ),
    ]
