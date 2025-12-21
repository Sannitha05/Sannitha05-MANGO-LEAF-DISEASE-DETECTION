from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from PIL import Image
from .predictor import predict_disease
import traceback
from .models import PredictionHistory
from django.utils.timezone import now
from django.views.decorators.http import require_http_methods

@csrf_exempt
def predict_api(request):
    if request.method == 'POST' and 'image' in request.FILES:
        try:
            image_file = request.FILES['image']
            image = Image.open(image_file)
            result = predict_disease(image)
            predicted_disease = result['label']
            confidence = result['confidence']
            history = PredictionHistory(
                predicted_disease=predicted_disease,
                confidence=confidence
            )
            history.save()
              # Debugging line to check the type of result
            print(result)  # Debugging line to check the result
            print(JsonResponse({'success': True, 'prediction': result}))
            return JsonResponse({'success': True, 'prediction': result})
        except Exception as e:
            traceback.print_exc() 
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)

from django.views.decorators.http import require_GET
from .models import PredictionHistory

@require_GET
def prediction_history(request):
    history = PredictionHistory.objects.order_by('-timestamp')[:100]  # Latest 100
    data = [entry.to_dict() for entry in history]
    print(data)
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_history_by_id(request, entry_id):
    print(entry_id)
    try:
        entry = PredictionHistory.objects.get(id=entry_id)
        entry.delete()
        return JsonResponse({"success": True, "message": f"Deleted entry ID {entry_id}."})
    except PredictionHistory.DoesNotExist:
        return JsonResponse({"success": False, "error": f"Entry ID {entry_id} not found."}, status=404)
