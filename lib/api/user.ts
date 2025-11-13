// lib/api/user.ts
export async function registrarUsuario(userData: any) {
  const response = await fetch("http://localhost:3001/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const message = errorData.message || "Error desconocido al registrar usuario"
    throw new Error(message)
  }

  return await response.json()
}
