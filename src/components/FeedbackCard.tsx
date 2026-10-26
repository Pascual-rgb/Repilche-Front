import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./styles/FeedbackCard.css";

export interface FeedbackCardProps {
  icon?: ReactNode;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  actionTo?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  secondaryActionTo?: string;
  className?: string;
}

const FeedbackCard = ({
  icon = "✓",
  title,
  message,
  actionText,
  onAction,
  actionTo,
  secondaryActionText,
  onSecondaryAction,
  secondaryActionTo,
  className = "",
}: FeedbackCardProps) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div className={`feedback-card ${className}`}>
      {icon && <div className="feedback-card-badge">{icon}</div>}
      <h2 className="feedback-card-title">{title}</h2>
      <p className="feedback-card-message">{message}</p>

      {(actionText || secondaryActionText) && (
        <div className="feedback-card-actions">
          {actionTo ? (
            <Link to={actionTo} className="feedback-btn-primary">
              {actionText}
            </Link>
          ) : actionText && (
            <button
              type="button"
              className="feedback-btn-primary"
              onClick={onAction}
            >
              {actionText}
            </button>
          )}

          {secondaryActionTo ? (
            <Link to={secondaryActionTo} className="feedback-btn-secondary">
              {secondaryActionText}
            </Link>
          ) : secondaryActionText && (
            <button
              type="button"
              className="feedback-btn-secondary"
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
