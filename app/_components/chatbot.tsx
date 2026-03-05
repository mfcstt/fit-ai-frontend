"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { cn } from "@/lib/utils";

const SUGGESTED_MESSAGES = [
  "Alterar plano de treino",
  "Mudar objetivo",
  "Atualizar informações",
];

export function Chatbot() {
  const [chatOpen, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false).withOptions({ shallow: true })
  );
  const [initialMessage, setInitialMessage] = useQueryState(
    "initial_message",
    parseAsString.withOptions({ shallow: true })
  );

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/ai",
    }),
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (chatOpen && initialMessage && !initialMessageSent.current) {
      initialMessageSent.current = true;
      sendMessage({ text: initialMessage });
      setInitialMessage(null);
    }
  }, [chatOpen, initialMessage, sendMessage, setInitialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  if (!chatOpen) return null;

  const isStreaming = status === "streaming";

  return (
    <div className="fixed inset-0 z-60 flex flex-col items-start px-4 pb-4 pt-40">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setChatOpen(false)}
      />
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-4xl bg-background w-full">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-primary/8 border border-primary/8 p-3">
              <Sparkles className="size-4.5 text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-base font-semibold leading-tight text-foreground">
                Coach AI
              </p>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-green-500" />
                <p className="text-xs leading-tight text-foreground">Online</p>
              </div>
            </div>
          </div>
          <button onClick={() => setChatOpen(false)}>
            <X className="size-6 text-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-start pr-10">
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-sm leading-[1.4] text-foreground">
                  Olá! Sou sua IA personal. Como posso ajudar com seu treino
                  hoje?
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";
            const text =
              message.parts
                ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("") ?? "";

            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col",
                  isUser ? "items-end pl-15" : "items-start pr-15"
                )}
              >
                <div
                  className={cn(
                    "rounded-xl p-3",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  )}
                >
                  {isUser ? (
                    <p className="text-sm leading-[1.4]">{text}</p>
                  ) : (
                    <div className="text-sm leading-[1.4] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <Streamdown
                        mode={
                          isStreaming &&
                          message.id === messages[messages.length - 1]?.id
                            ? "streaming"
                            : "static"
                        }
                      >
                        {text}
                      </Streamdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 0 && (
          <div className="flex shrink-0 gap-2.5 overflow-x-auto px-5 pb-3">
            {SUGGESTED_MESSAGES.map((msg) => (
              <button
                key={msg}
                onClick={() => handleSuggestion(msg)}
                className="shrink-0 rounded-full bg-[#e2e9fe] px-4 py-2 text-sm text-foreground"
              >
                {msg}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex shrink-0 items-center gap-2 border-t border-border p-5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Digite sua mensagem"
            className="flex-1 rounded-full bg-secondary border border-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="flex size-10.5 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
