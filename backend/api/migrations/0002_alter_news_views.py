# Generated by Django 5.0.6 on 2024-05-31 09:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="news",
            name="views",
            field=models.ManyToManyField(
                blank=True, default=None, null=True, related_name="news", to="api.view"
            ),
        ),
    ]
