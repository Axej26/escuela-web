"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Plus, Trash, ChevronDown } from "lucide-react";

import TimePickerModal from "@/components/TimePickerModal";

type Slot = { from: string; to: string };
type DayRow = { day: string; enabled: boolean; slots: Slot[] };

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export default function TimeSlotsConfig() {
  // inicial: cada día inactivo y con 1 slot vacío
  const initial: DayRow[] = days.map((d) => ({
    day: d,
    enabled: false,
    slots: [{ from: "", to: "" }],
  }));

  const [rows, setRows] = useState<DayRow[]>(initial);

  // modal state para el TimePicker
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [activeField, setActiveField] = useState<"from" | "to">("from");

  // abrir modal para un campo específico
  const openTimeModal = (dayIdx: number, slotIdx: number, field: "from" | "to") => {
    setActiveDayIndex(dayIdx);
    setActiveSlotIndex(slotIdx);
    setActiveField(field);
    setModalOpen(true);
  };

  // recibir hora seleccionada desde el modal
  const handleSelectTime = (time24: string) => {
    if (activeDayIndex === null || activeSlotIndex === null) return;
    const copy = [...rows];
    copy[activeDayIndex].slots[activeSlotIndex][activeField] = time24;
    setRows(copy);
  };

  // toggle on/off día
  const toggleDay = (index: number) => {
    const copy = [...rows];
    copy[index].enabled = !copy[index].enabled;
    setRows(copy);
  };

  // agregar intervalo (icono +) dentro del día
  const addSlot = (dayIndex: number) => {
    const copy = [...rows];
    copy[dayIndex].slots.push({ from: "", to: "" });
    setRows(copy);
  };

  // eliminar intervalo (icono trash)
  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const copy = [...rows];
    copy[dayIndex].slots.splice(slotIndex, 1);
    if (copy[dayIndex].slots.length === 0) copy[dayIndex].slots.push({ from: "", to: "" });
    setRows(copy);
  };

  // actualizar nombre de día (select) u otros campos simples
  const updateDayField = (dayIndex: number, field: keyof DayRow | "from" | "to", value: any, slotIndex?: number) => {
    const copy = [...rows];
    if (field === "from" || field === "to") {
      if (typeof slotIndex === "number") {
        copy[dayIndex].slots[slotIndex][field] = value;
      }
    } else {
      // only day / enabled / slots - we only use day updates from select
      // @ts-ignore
      copy[dayIndex][field] = value;
    }
    setRows(copy);
  };

  // guardar todo en backend (POST por cada intervalo activo)
  const saveAll = async () => {
    try {
      for (const row of rows) {
        if (!row.enabled) continue;
        for (const s of row.slots) {
          if (!s.from || !s.to) {
            toast.error(`Completa todos los horarios de ${row.day}`);
            return;
          }
          if (s.to <= s.from) {
            toast.error(`La hora final debe ser mayor que la inicial en ${row.day}`);
            return;
          }
          await fetch("http://localhost:3000/timeslots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dayOfWeek: row.day,
              startTime: s.from,
              endTime: s.to,
            }),
          });
        }
      }
      toast.success("Horarios guardados");
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron guardar los horarios");
    }
  };

  return (
    <>
      <Toaster />

      {/* TimePicker Modal (reloj analógico) */}
      <TimePickerModal
        open={modalOpen}
        initialTime={
          activeDayIndex !== null && activeSlotIndex !== null
            ? rows[activeDayIndex].slots[activeSlotIndex][activeField]
            : undefined
        }
        onClose={() => setModalOpen(false)}
        onSelectTime={handleSelectTime}
      />

      <div className="w-full max-w-4xl mx-auto mt-8 space-y-4 px-4">
        <h2 className="text-2xl font-semibold">Configuración de Horarios</h2>

        <FieldGroup>
          {rows.map((row, dayIdx) => (
            <div key={row.day} className="border rounded-lg p-4 space-y-3">
              {/* header: día + switch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{row.day}</h3>
                  <FieldDescription>{row.enabled ? "Activo" : "Inactivo"}</FieldDescription>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch checked={row.enabled} onCheckedChange={() => toggleDay(dayIdx)} />
                    <span className="text-sm text-muted-foreground">Activar</span>
                  </div>
                </div>
              </div>

              {/* slots (intervalos) */}
              {row.enabled && (
                <div className="space-y-3">
                  {row.slots.map((s, slotIdx) => (
                    <div key={slotIdx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      {/* Desde */}
                      <Field>
                        <FieldLabel>Desde</FieldLabel>
                        <Input
                          readOnly
                          value={s.from}
                          placeholder="Selecciona hora"
                          className="cursor-pointer"
                          onClick={() => openTimeModal(dayIdx, slotIdx, "from")}
                        />
                      </Field>

                      {/* Hasta */}
                      <Field>
                        <FieldLabel>Hasta</FieldLabel>
                        <Input
                          readOnly
                          value={s.to}
                          placeholder="Selecciona hora"
                          className="cursor-pointer"
                          onClick={() => openTimeModal(dayIdx, slotIdx, "to")}
                        />
                      </Field>

                      {/* acciones iconos: añadir intervalo (solo en la última columna) */}
                      <div className="col-span-1 md:col-span-2 flex gap-2 justify-end items-center">
                        {/* Agregar intervalo (icono) */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => addSlot(dayIdx)}
                          aria-label={`Agregar intervalo a ${row.day}`}
                          className="rounded-full"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>

                        {/* Eliminar intervalo (si hay más de 1) */}
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeSlot(dayIdx, slotIdx)}
                          aria-label={`Eliminar intervalo de ${row.day}`}
                          className="rounded-full"
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </FieldGroup>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button onClick={saveAll}>Guardar todo</Button>
          </div>
        </div>
      </div>
    </>
  );
}
