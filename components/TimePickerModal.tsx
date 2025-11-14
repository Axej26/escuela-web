"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  initialTime?: string; // "HH:MM"
  onClose: () => void;
  onSelectTime: (time24: string) => void; // "HH:MM"
};

export default function TimePickerModal({ open, initialTime, onClose, onSelectTime }: Props) {
  // parse initial HH:MM
  const parse = (t?: string) => {
    if (!t) return { hour: 12, minute: 0 };
    const [hh, mm] = t.split(":").map((s) => parseInt(s, 10));
    return { hour: isNaN(hh) ? 12 : hh, minute: isNaN(mm) ? 0 : mm };
  };

  const init = parse(initialTime);

  const [hour, setHour] = useState<number>(init.hour || 12);
  const [minute, setMinute] = useState<number>(init.minute || 0);
  const [selecting, setSelecting] = useState<"hour" | "minute">("hour");

  useEffect(() => {
    const p = parse(initialTime);
    setHour(p.hour || 12);
    setMinute(p.minute || 0);
    setSelecting("hour");
  }, [initialTime, open]);

  const pad = (n: number) => String(n).padStart(2, "0");

  //-------------------------------------
  // CORRECCIÓN: Ángulos completamente precisos
  //-------------------------------------
  const handleClockClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Ángulo REAL desde las 12
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    deg = (deg + 360) % 360;

    if (selecting === "hour") {
      const h = Math.round(deg / 30);
      const value = h === 0 ? 12 : h;
      setHour(value);
      setSelecting("minute");
    } else {
      const m = Math.round(deg / 6) % 60;
      setMinute(m);
    }
  };

  //-------------------------------------
  // ANGULO VISUAL DE LA MANECILLA
  //-------------------------------------
  const needleAngle = () => {
    if (selecting === "hour") {
      return (hour % 12) * 30; // 0..330
    }
    return minute * 6; // 0..354
  };

  //-------------------------------------
  // GENERAR NUMEROS DEL RELOJ
  //-------------------------------------
  const renderHourNumbers = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const angle = ((num % 12) / 12) * 2 * Math.PI - Math.PI / 2;
      const r = 80;
      const cx = 120 + Math.cos(angle) * r;
      const cy = 120 + Math.sin(angle) * r;
      return (
        <text
          key={num}
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[14px] fill-gray-900"
        >
          {num}
        </text>
      );
    });
  };

  const renderMinuteMarkers = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const m = i * 5;
      const angle = (m / 60) * 2 * Math.PI - Math.PI / 2;
      const r = 80;
      const cx = 120 + Math.cos(angle) * r;
      const cy = 120 + Math.sin(angle) * r;
      return (
        <text
          key={m}
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[12px] fill-gray-700"
        >
          {String(m).padStart(2, "0")}
        </text>
      );
    });
  };

  const applyTime = () => {
    const hh = pad(hour);
    const mm = pad(minute);
    onSelectTime(`${hh}:${mm}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Selecciona la hora</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* HORA MOSTRADA */}
          <div className="text-3xl font-semibold tracking-wide">
            {pad(hour)}:{pad(minute)}
          </div>

          {/* RELOJ */}
          <svg
            width={240}
            height={240}
            onClick={handleClockClick}
            className="cursor-pointer select-none"
          >
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
              </filter>
            </defs>

            <circle
              cx="120"
              cy="120"
              r="100"
              fill="#fff"
              stroke="#e5e7eb"
              strokeWidth="1"
              filter="url(#shadow)"
            />

            {selecting === "hour" ? renderHourNumbers() : renderMinuteMarkers()}

            {/* MANECILLA ANIMADA */}
            <g
              style={{ transition: "transform 0.2s ease" }}
              transform={`rotate(${needleAngle()} 120 120)`}
            >
              <line
                x1="120"
                y1="120"
                x2="120"
                y2="40"
                stroke="#111827"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="120" cy="120" r="4" fill="#111827" />
            </g>
          </svg>

          {/* BOTONES */}
          <div className="flex gap-2 w-full items-center">
            <Button
              variant={selecting === "hour" ? "default" : "outline"}
              onClick={() => setSelecting("hour")}
              className="w-20"
            >
              Hora
            </Button>

            <Button
              variant={selecting === "minute" ? "default" : "outline"}
              onClick={() => setSelecting("minute")}
              className="w-24"
            >
              Minutos
            </Button>

            <div className="flex-1" />

            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <Button onClick={applyTime}>Aceptar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
