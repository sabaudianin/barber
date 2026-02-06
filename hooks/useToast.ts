import { useCallback, useRef, useState } from "react";
import type { Toast } from "@/types/types";

export function useToast(timeout = 4000) {
  const [toast, setToast] = useState<Toast>(null);
  const timerRef = useRef<number | null>(null);

  const showToast = useCallback(
    (t: Toast) => {
      setToast(t);

      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (!t) return;

      timerRef.current = window.setTimeout(() => setToast(null), timeout);
    },
    [timeout],
  );

  return { toast, showToast };
}
