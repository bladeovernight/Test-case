from rest_framework import serializers
from .models import Task, Category

class TaskSerializer(serializers.ModelSerializer):
    category = serializers.CharField()  

    def create(self, validated_data):
        category_name = validated_data.pop('category')
        category, _ = Category.objects.get_or_create(name=category_name)
        validated_data['category'] = category
        return super().create(validated_data)

    def update(self, instance, validated_data):
        category_name = validated_data.pop('category', instance.category.name)
        category, _ = Category.objects.get_or_create(name=category_name)
        validated_data['category'] = category
        return super().update(instance, validated_data)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'category', 'created_at', 'updated_at', 'user']
        read_only_fields = ['user', 'created_at', 'updated_at']
