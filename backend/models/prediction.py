from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship

from db.database import Base


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    predicted_class = Column(String(255), nullable=False)
    tree_id = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    all_predictions = Column(JSON, nullable=False)  # [{predicted_class, tree_id, confidence}, ...]
    image_paths = Column(JSON, nullable=False)  # ["uploads/1/1706540000/image_0.jpg", ...]
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="predictions")
