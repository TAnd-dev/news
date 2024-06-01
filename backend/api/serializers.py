from rest_framework import serializers

from .models import News, Tag, View


class TagCreateSerializer(serializers.ModelSerializer):

    def create(self, validate_data):
        tag = Tag.objects.create(
            name=validate_data.get('name'),
            slug=validate_data.get('slug')
        )
        return tag

    def to_representation(self, instance):
        return TagViewSerializer(instance).data

    class Meta:
        model = Tag
        fields = ('name',)


class TagViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class ViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = View
        fields = '__all__'


class NewsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ('title', 'text', 'image', 'tags')


class NewsSerializer(serializers.ModelSerializer):
    tags = TagViewSerializer(many=True)
    views = ViewSerializer(many=True)

    class Meta:
        model = News
        fields = '__all__'
