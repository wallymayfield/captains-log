import { Modal } from "./Modal";
import { Pill } from "./primitives";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  okLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  okLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} refId="29-1701" onClose={onCancel}>
      <p className="lcars-modal__message">{message}</p>
      <footer className="lcars-modal__footer lcars-modal__footer--split">
        <Pill label={cancelLabel} color="violet" onClick={onCancel} />
        <Pill
          label={okLabel}
          color={destructive ? "red" : "orange"}
          onClick={onConfirm}
        />
      </footer>
    </Modal>
  );
}
