"use client";

import { useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/cn";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
};

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
}

function dateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function DatePicker({ value, onChange, min, max, required, className, "aria-label": ariaLabel }: DatePickerProps) {
  const selectedDate = parseDate(value);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, index) =>
    new Date(viewDate.getFullYear(), viewDate.getMonth(), index - mondayOffset + 1),
  );

  function changeMonth(offset: number) {
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + offset, 1));
  }

  return (
    <Popover open={open} onOpenChange={(nextOpen) => {
      if (nextOpen) setViewDate(parseDate(value) ?? new Date());
      setOpen(nextOpen);
    }}>
      <div className="relative">
        <PopoverTrigger
          render={
            <button
              ref={triggerRef}
              type="button"
              aria-label={ariaLabel}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md border border-border-strong bg-surface px-2.5 text-left text-[13px] text-ink-secondary outline-none transition-colors hover:bg-neutral-tint focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-tint-border",
                className,
              )}
            />
          }
        >
          <span className={cn("truncate", !selectedDate && "text-ink-faint")}>
            {selectedDate ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(selectedDate) : "Select date"}
          </span>
          <CalendarDays className="h-4 w-4 shrink-0 text-ink-muted" />
        </PopoverTrigger>
        {required ? (
          <input
            type="text"
            required
            aria-hidden="true"
            tabIndex={-1}
            value={value}
            onChange={() => undefined}
            onInvalid={(event) => {
              event.preventDefault();
              triggerRef.current?.focus();
              setOpen(true);
            }}
            className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
          />
        ) : null}
      </div>
      <PopoverContent align="start" className="w-70 gap-3 p-3">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-secondary hover:bg-neutral-tint focus-visible:outline-2 focus-visible:outline-accent-strong">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-ink">
            {new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(viewDate)}
          </p>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Next month" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-secondary hover:bg-neutral-tint focus-visible:outline-2 focus-visible:outline-accent-strong">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-ink-muted" aria-hidden="true">
          {weekdays.map((weekday) => <span key={weekday} className="py-1">{weekday}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1" role="group" aria-label="Choose a date">
          {days.map((date) => {
            const key = dateValue(date);
            const isSelected = selectedDate && key === dateValue(selectedDate);
            const disabled = Boolean((min && key < min.slice(0, 10)) || (max && key > max.slice(0, 10)));
            return (
              <button
                key={key}
                type="button"
                aria-label={new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date)}
                aria-pressed={Boolean(isSelected)}
                disabled={disabled}
                onClick={() => { onChange(key); setOpen(false); }}
                className={cn(
                  "h-8 rounded-md text-xs tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-accent-strong",
                  isSelected ? "bg-ink font-semibold text-white" : "text-ink-secondary hover:bg-neutral-tint",
                  date.getMonth() !== viewDate.getMonth() && "text-ink-faint",
                  disabled && "cursor-not-allowed opacity-30 hover:bg-transparent",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
        {value ? (
          <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="w-full border-t border-border pt-2 text-left text-xs font-medium text-ink-muted hover:text-ink">
            Clear date
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

export function DateTimePicker({ value, onChange, className, "aria-label": ariaLabel }: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  "aria-label"?: string;
}) {
  const [date = "", time = ""] = value.split("T");

  return (
    <div className={cn("flex gap-2", className)}>
      <DatePicker
        value={date}
        onChange={(nextDate) => onChange(nextDate ? `${nextDate}T${time || "00:00"}` : "")}
        aria-label={ariaLabel ? `${ariaLabel} date` : "Date"}
        className="h-10 min-w-0 flex-1"
      />
      <input
        type="time"
        value={time}
        disabled={!date}
        onChange={(event) => onChange(date ? `${date}T${event.target.value || "00:00"}` : "")}
        aria-label={ariaLabel ? `${ariaLabel} time` : "Time"}
        className="h-10 min-w-28 rounded-md border border-border-strong bg-surface px-2.5 text-[13px] text-ink-secondary outline-none focus:border-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
