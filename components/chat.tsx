"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Send, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

type Message = {
  id: string;
  from: string;
  text?: string;
  time?: string;
};
const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
const socket = io("http://localhost:3001", {
  query: { token }, // 💡 Envia el token en el handshake
  transports: ["websocket"], // Opcional: fuerza uso de WebSocket puro
});

export default function Chat() {
  const [myId, setMyId] = useState("");
  const [myName, setMyName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); // ✅ FIX
  const [text, setText] = useState("");
  const [targetId, setTargetId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado con ID:", socket.id);
    });

    socket.on("myId", (data) => {
      setMyId(data.id);
      setMyName(data.userName)
      console.log("mi Id:", data.id);
      console.log("Mi nombre:",data.userName)
    });

    socket.on("private_message", (data) => {
      console.log("📩 Nuevo mensaje:", data);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), from: data.from, text: data.message },
      ]);
    });

    return () => {
      socket.off("private_message");
      socket.off("myId");
    };
  }, []);

  const sendPrivate = () => {
    if (!targetId || !text) return;
    socket.emit("private_message", {
      targetSocketId: targetId,
      message: text,
    });
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: "me", text },
    ]);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrivate();
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="max-w-3xl mx-auto h-[70vh] flex flex-col shadow-md">
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar>
          <AvatarImage src="/avatar-other.jpg" alt="Soporte" />
          <AvatarFallback>SO</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-sm font-medium">mi nombre: {myName}</h3>
          <Input
            placeholder="ID del destinatario"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">En línea • responde rápido</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Info</Button>
        </div>
      </div>

      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <div
          ref={containerRef}
          className="flex-1 overflow-auto p-4 space-y-3 bg-gradient-to-b from-white to-slate-50"
          role="log"
          aria-live="polite"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[80%]">
                  <div
                    className={`inline-block px-4 py-2 rounded-2xl shadow-sm break-words text-sm leading-relaxed whitespace-pre-wrap ${
                      m.from === "me"
                        ? "bg-sky-600 text-white rounded-br-none"
                        : "bg-white border border-slate-200 text-slate-900 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <div
                    className={`text-[10px] mt-1 ${
                      m.from === "me"
                        ? "text-right text-slate-400"
                        : "text-left text-slate-400"
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
                key="typing"
              >
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full animate-pulse bg-slate-400" />
                    <div className="h-2 w-2 rounded-full animate-pulse bg-slate-400" />
                    <div className="h-2 w-2 rounded-full animate-pulse bg-slate-400" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t p-3 bg-white">
          <div className="flex items-end gap-2">
            <button
              aria-label="adjuntar"
              className="p-2 rounded-md hover:bg-slate-100"
              title="Adjuntar"
            >
              <Paperclip size={18} />
            </button>

            <div className="flex-1">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe un mensaje..."
                onKeyDown={handleKeyDown}
                aria-label="mensaje"
                className="h-10"
              />
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => alert("Adjuntar imagen")}
                className="p-2 rounded-md hover:bg-slate-100"
                title="Foto"
              >
                <Camera size={18} />
              </button>

              <Button onClick={sendPrivate} disabled={sending}>
                <div className="flex items-center gap-2">
                  <Send size={14} />
                  <span className="text-sm">Enviar</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
