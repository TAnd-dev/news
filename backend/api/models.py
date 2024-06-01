import uuid
from django.db import models
from django.template.defaultfilters import slugify
from unidecode import unidecode


class News(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=124)
    text = models.TextField()
    image = models.ImageField(upload_to='gallery/')
    tags = models.ManyToManyField('Tag', related_name='news', null=True, blank=True)
    views = models.ManyToManyField('View', related_name='news', null=True, blank=True, default=None)
    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Tag(models.Model):
    slug = models.SlugField(max_length=72, unique=True, null=False)
    name = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(unidecode(self.name))
        super(Tag, self).save(*args, **kwargs)


class View(models.Model):
    date = models.DateTimeField(auto_now_add=True)
