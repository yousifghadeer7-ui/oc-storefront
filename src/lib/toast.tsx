"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Kind = "success" | "error" | "info";
interface Toast {
  id: number;
  msg: string;
  kind: Kind;
}

interface ToastCtx {
  push: (msg: string, kind?: Kind) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast outside provider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = useCallback((msg: string, kind: Kind = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex w-full items-center gap-3 border px-4 py-3 text-sm shadow-[0_12px_40px_rgba(0,0,0,0.18)] animate-toast-in ${
              t.kind === "error"
                ? "border-danger/40 bg-ink text-paper"
                : "border-line-dark bg-ink text-paper"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                t.kind === "error"
                  ? "bg-danger"
                  : t.kind === "info"
                    ? "bg-paper/60"
                    : "bg-success"
              }`}
            />
            <span className="font-sans tracking-wide">{t.msg}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
