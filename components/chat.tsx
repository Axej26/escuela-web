"use client"
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Send, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  from: "me" | "other";
  text?: string;
  time?: string; // ISO or simple hh:mm
  attachments?: { name: string; url?: string }[];
};

export default function Chat({
  initialMessages = [],
  onSendMessage,
}: {
  initialMessages?: Message[];
  onSendMessage?: (text: string) => Promise<Message | void>;
}) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length
      ? initialMessages
      : [
          { id: "1", from: "other", text: "Hola! ¿En qué te puedo ayudar?", time: "09:01" },
          { id: "2", from: "me", text: "Quiero información sobre el producto.", time: "09:02" },
        ]
  );
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll a final cuando cambian mensajes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    const newMsg: Message = {
      id: String(Date.now()),
      from: "me",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((m) => [...m, newMsg]);
    setText("");

    try {
      if (onSendMessage) {
        const reply = await onSendMessage(trimmed);
        // Si onSendMessage regresa una respuesta, agrégala
        if (reply) setMessages((m) => [...m, reply]);
      } else {
        // Mock de respuesta (si no hay backend)
        setIsTyping(true);
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            {
              id: String(Date.now() + 1),
              from: "other",
              text: `Respuesta automática a: "${trimmed}"`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsTyping(false);
        }, 900);
      }
    } catch (err) {
      // manejar errores (mostrar toast / UI)
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="max-w-3xl mx-auto h-[70vh] flex flex-col shadow-md">
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar>
          <AvatarImage src="/avatar-other.jpg" alt="Soporte" />
          <AvatarFallback>SO</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-sm font-medium">Soporte Fuxion</h3>
          <p className="text-xs text-muted-foreground">En línea • responde rápido</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Info</Button>
        </div>
      </div>

      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        {/* Mensajes: contenedor scroll */}
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
                  <div className={`text-[10px] mt-1 ${m.from === "me" ? "text-right text-slate-400" : "text-left text-slate-400"}`}>
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

        {/* Composer */}
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
                onClick={() => {
                  // placeholder para adjuntar foto
                  alert("Adjuntar — implementar carga real (S3, endpoint multipart)");
                }}
                className="p-2 rounded-md hover:bg-slate-100"
                title="Foto"
              >
                <Camera size={18} />
              </button>

              <Button onClick={handleSend} disabled={sending}>
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

