"use client"

import { useState } from "react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserRegisterForm() {
  const [formData, setFormData] = useState({
    user_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    direccion: "",
    rol: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const formatPhone = (value: string) => {
    value = value.replace(/\D/g, "")
    if (value.length > 3 && value.length <= 6) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`
    }
    return value
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.")
      return
    }
    console.log("Datos enviados:", formData)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">
            Registro de Usuario
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldSet>
              <FieldLegend className="text-sm text-muted-foreground mb-2">
                Completa los campos para registrar un nuevo usuario.
              </FieldLegend>

              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre y Apellido */}
                <Field>
                  <FieldLabel htmlFor="user_name">Nombre</FieldLabel>
                  <Input
                    id="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    placeholder="Ej. Juan"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="last_name">Apellidos</FieldLabel>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Ej. Pérez López"
                    required
                  />
                </Field>

                {/* Teléfono y Correo */}
                <Field>
                  <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: formatPhone(e.target.value),
                      })
                    }
                    placeholder="555-123-4567"
                    maxLength={12}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </Field>

                {/* Contraseña y Confirmación */}
                <Field>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirmar contraseña
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="********"
                    required
                  />
                </Field>

                {/* Edad y Rol */}
                <Field>
                  <FieldLabel htmlFor="age">Edad</FieldLabel>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Ej. 25"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>Rol de usuario</FieldLabel>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, rol: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="profesor">Profesor</SelectItem>
                      <SelectItem value="alumno">Alumno</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Dirección (ocupa toda la fila) */}
                <div className="md:col-span-2">
                  <Field>
                    <FieldLabel htmlFor="direccion">Dirección</FieldLabel>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Ej. Calle 123, Colonia, Ciudad"
                      required
                    />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>

            <Button type="submit" className="w-full">
              Registrar Usuario
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
