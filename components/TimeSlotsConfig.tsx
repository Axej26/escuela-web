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

import { Plus, Trash, ChevronDown } from "lucide-react";
import TimePickerModal from "@/components/TimePickerModal";

type Slot = { from: string; to: string };
type DayRow = { day: string; enabled: boolean; slots: Slot[]; open: boolean };

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export default function TimeSlotsConfig() {
  const initial: DayRow[] = days.map((d) => ({
    day: d,
    enabled: false,
    open: false,
    slots: [{ from: "", to: "" }],
  }));

  const [rows, setRows] = useState<DayRow[]>(initial);

  // MODAL TIMEPICKER
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [activeField, setActiveField] = useState<"from" | "to">("from");

  const openTimeModal = (dayIdx: number, slotIdx: number, field: "from" | "to") => {
    setActiveDayIndex(dayIdx);
    setActiveSlotIndex(slotIdx);
    setActiveField(field);
    setModalOpen(true);
  };

  const handleSelectTime = (time24: string) => {
    if (activeDayIndex === null || activeSlotIndex === null) return;
    const copy = [...rows];
    copy[activeDayIndex].slots[activeSlotIndex][activeField] = time24;
    setRows(copy);
  };

  const toggleDay = (index: number) => {
    const copy = [...rows];
    copy[index].enabled = !copy[index].enabled;
    setRows(copy);
  };

  const toggleDropdown = (index: number) => {
    const copy = [...rows];
    copy[index].open = !copy[index].open;
    setRows(copy);
  };

  const addSlot = (dayIndex: number) => {
    const copy = [...rows];
    copy[dayIndex].slots.push({ from: "", to: "" });
    setRows(copy);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const copy = [...rows];
    copy[dayIndex].slots.splice(slotIndex, 1);
    if (copy[dayIndex].slots.length === 0) copy[dayIndex].slots.push({ from: "", to: "" });
    setRows(copy);
  };

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
              
              {/* -------- HEADER DÍA -------- */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleDropdown(dayIdx)}
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{row.day}</h3>
                  <FieldDescription>{row.enabled ? "Activo" : "Inactivo"}</FieldDescription>
                </div>

                <div className="flex items-center gap-4">
                  <Switch
                    checked={row.enabled}
                    onCheckedChange={() => toggleDay(dayIdx)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      row.open ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* ---------- CONTENIDO OCULTO (SLOTS) ---------- */}
              {row.open && row.enabled && (
                <div className="space-y-3 pt-3 border-t">
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

                      {/* Acciones */}
                      <div className="col-span-1 md:col-span-2 flex gap-2 justify-end items-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => addSlot(dayIdx)}
                          aria-label="Agregar intervalo"
                          className="rounded-full"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeSlot(dayIdx, slotIdx)}
                          aria-label="Eliminar intervalo"
                          className="rounded-full"
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Si está abierto pero el día está apagado */}
              {row.open && !row.enabled && (
                <p className="text-sm text-muted-foreground mt-2">
                  Activa el día para configurar horarios.
                </p>
              )}
            </div>
          ))}
        </FieldGroup>

        <div className="flex items-center justify-end">
          <Button onClick={saveAll}>Guardar todo</Button>
        </div>
      </div>
    </>
  );
}
