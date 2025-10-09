// src/hooks/useChatSocket.ts (o donde guardes tus hooks)

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// 💡 Define el tipo de datos que viene del backend
type BackendMessage = {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
};

// 💡 Define el tipo de datos para el frontend
type FrontendMessage = {
  id: string;
  from: "me" | "other";
  text: string;
  time: string;
};

// Ajusta esta URL a la dirección de tu NestJS WebSocket Gateway
const WS_URL = 'http://localhost:3000'; 

/**
 * Hook para gestionar la conexión y lógica del chat con Socket.IO.
 * @param currentUserId El ID del usuario actual.
 */
export const useChatSocket = (currentUserId: string) => {
  const [messages, setMessages] = useState<FrontendMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Helper para transformar el mensaje del backend al formato del frontend
  const toFrontendMessage = (msg: BackendMessage): FrontendMessage => ({
    id: msg.id,
    from: msg.userId === currentUserId ? "me" : "other",
    text: msg.message,
    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  useEffect(() => {
    // 1. Conecta al servidor
    const socket = io(WS_URL);
    socketRef.current = socket;

    // 2. Manejo de conexión/desconexión
    socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
      setIsConnected(true);
      // 3. Solicita el historial de mensajes al conectar
      socket.emit('getMessages');
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
      setIsConnected(false);
    });

    // 4. Escucha el evento 'messages' (historial)
    socket.on('messages', (history: BackendMessage[]) => {
      console.log('Historial recibido', history);
      const initialMsgs: FrontendMessage[] = history.map(toFrontendMessage);
      setMessages(initialMsgs);
    });

    // 5. Escucha el evento 'message' (nuevos mensajes)
    socket.on('message', (newMessage: BackendMessage) => {
      console.log('Nuevo mensaje recibido', newMessage);
      setMessages((m) => [...m, toFrontendMessage(newMessage)]);
    });

    // 6. Limpia la conexión al desmontar el componente
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('messages');
      socket.off('message');
      socket.disconnect();
    };
  }, [currentUserId]); // Se ejecuta solo si el userId cambia

  // Función para enviar un mensaje (será llamada por el componente de UI)
  const sendMessage = useCallback((message: string) => {
    if (!socketRef.current || !message.trim()) return;

    // El payload debe coincidir con el NestJS Gateway: { userId: string; message: string }
    socketRef.current.emit('message', { userId: currentUserId, message });
    // No actualizamos el estado aquí, esperamos que el servidor nos devuelva el mensaje
  }, [currentUserId]);

  return { messages, isConnected, sendMessage };
};