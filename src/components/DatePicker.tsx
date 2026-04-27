import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Pill } from "./primitives";
import { formatISODate } from "@/lib/document";

const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

type DatePickerProps = {
  open: boolean;
  value: string;
  onChange: (iso: string) => void;
  onClose: () => void;
};

function parseISO(iso: string): { y: number; m: number; d: number } {
  const parts = iso.split("-").map(Number);
  return {
    y: Number(parts[0]) || new Date().getFullYear(),
    m: (Number(parts[1]) || 1) - 1,
    d: Number(parts[2]) || 1,
  };
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function DatePicker({
  open,
  value,
  onChange,
  onClose,
}: DatePickerProps) {
  const initial = parseISO(value);
  const [view, setView] = useState({ y: initial.y, m: initial.m });

  // Resync when the modal opens with a different selected value.
  useEffect(() => {
    if (open) setView({ y: initial.y, m: initial.m });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, value]);

  if (!open) return null;

  const startWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const today = formatISODate(new Date());

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to a fixed 6-row grid so the modal doesn't resize between
  // months with different week counts.
  while (cells.length < 42) cells.push(null);

  const select = (d: number) => {
    onChange(toISO(view.y, view.m, d));
    onClose();
  };

  const prevMonth = () =>
    setView((v) =>
      v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 },
    );
  const nextMonth = () =>
    setView((v) =>
      v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 },
    );

  return (
    <Modal
      open={open}
      title="Stardate Selection"
      refId="14-2410"
      onClose={onClose}
    >
      <div className="lcars-datepicker__nav">
        <Pill
          label="◀"
          color="violet"
          onClick={prevMonth}
          ariaLabel="Previous month"
        />
        <span className="lcars-datepicker__viewlabel">
          {MONTH_NAMES[view.m]} {view.y}
        </span>
        <Pill
          label="▶"
          color="violet"
          onClick={nextMonth}
          ariaLabel="Next month"
        />
      </div>
      <div className="lcars-datepicker__grid">
        {DAY_HEADERS.map((h, i) => (
          <span
            key={`h${i}`}
            className="lcars-datepicker__dayheader"
            aria-hidden="true"
          >
            {h}
          </span>
        ))}
        {cells.map((d, i) => {
          if (d === null) {
            return (
              <span
                key={`e${i}`}
                className="lcars-datepicker__empty"
                aria-hidden="true"
              />
            );
          }
          const iso = toISO(view.y, view.m, d);
          const isSelected = iso === value;
          const isToday = iso === today;
          const cls = [
            "lcars-datepicker__day",
            isSelected ? "lcars-datepicker__day--selected" : "",
            isToday ? "lcars-datepicker__day--today" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={`d${d}`}
              type="button"
              className={cls}
              onClick={() => select(d)}
              aria-label={iso}
            >
              {d}
            </button>
          );
        })}
      </div>
      <footer className="lcars-modal__footer lcars-modal__footer--split">
        <Pill
          label="TODAY"
          color="peach"
          onClick={() => {
            onChange(today);
            onClose();
          }}
        />
        <Pill label="DISMISS" color="orange" onClick={onClose} />
      </footer>
    </Modal>
  );
}
