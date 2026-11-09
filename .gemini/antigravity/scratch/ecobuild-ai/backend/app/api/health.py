from fastapi import APIRouter
import datetime

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "EcoBuild AI Intelligence Engine",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
