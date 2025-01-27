from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer


class TaskAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Возвращает список всех задач.
        """
        tasks = Task.objects.all()
        # Фильтрация (опционально)
        status_filter = request.query_params.get('status')
        category_filter = request.query_params.get('category')
        if status_filter:
            tasks = tasks.filter(status=status_filter)
        if category_filter:
            tasks = tasks.filter(category=category_filter)

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Создает новую задачу и связывает её с текущим авторизованным пользователем.
        """
        data = request.data.copy()
        data['user'] = request.user.id  # Связываем задачу с текущим пользователем

        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        """
        Обновляет задачу по `pk`.
        """
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Удаляет задачу по `pk`.
        """
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        task.delete()
        return Response({'message': 'Task deleted'}, status=status.HTTP_204_NO_CONTENT)


class TimesheetCalculateDaysAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Рассчитывает данные табеля по указанным user_ids и месяцу.
        """
        data = request.data
        user_ids = data.get('user_ids')
        month = data.get('month')

        # Валидация входных данных
        if not user_ids or not isinstance(user_ids, list):
            return Response(
                {'error': 'Поле user_ids отсутствует или имеет неверный формат. Ожидается список.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not month or not isinstance(month, str):
            return Response(
                {'error': 'Поле month отсутствует или имеет неверный формат. Ожидается строка.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка формата месяца
        if len(month) != 7 or month[4] != '-' or not month.replace('-', '').isdigit():
            return Response(
                {'error': 'Поле month должно быть формата YYYY-MM.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Если данные валидны, продолжить обработку (пример результата)
        result = {
            'user_ids': user_ids,
            'month': month,
            'days_calculated': 20  # Пример данных
        }
        return Response(result, status=status.HTTP_200_OK)
