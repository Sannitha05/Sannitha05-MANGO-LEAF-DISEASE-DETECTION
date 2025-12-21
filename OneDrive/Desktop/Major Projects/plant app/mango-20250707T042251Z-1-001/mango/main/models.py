from django.db import models

class PredictionHistory(models.Model):
    predicted_disease = models.CharField(max_length=100)
    confidence = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def to_dict(self):
        return {
            "id": self.id,
            "predictedDisease": self.predicted_disease,
            "confidence": round(self.confidence, 2),
            "timestamp": self.timestamp.isoformat()
        }
