type ErrorBannerProps = {
  message: string;
  onDismiss: () => void;
};

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="lcars-error" role="alert">
      <span className="lcars-error__label">Red alert</span>
      <span className="lcars-error__message">{message}</span>
      <button
        type="button"
        className="lcars-error__dismiss"
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  );
}
