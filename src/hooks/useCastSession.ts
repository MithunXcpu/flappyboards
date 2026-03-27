"use client";

import { useState, useEffect, useCallback } from "react";

export function useCastSession() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [connection, setConnection] = useState<any>(null);

  // Check if Presentation API is available
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setIsAvailable(typeof window !== "undefined" && "PresentationRequest" in (window as any));
  }, []);

  const startCasting = useCallback(
    async (tvUrl: string) => {
      if (!isAvailable) return;

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const request = new (window as any).PresentationRequest([tvUrl]);
        const conn = await request.start();
        setConnection(conn);
        setIsConnected(true);

        conn.addEventListener("close", () => {
          setIsConnected(false);
          setConnection(null);
        });

        conn.addEventListener("terminate", () => {
          setIsConnected(false);
          setConnection(null);
        });
      } catch {
        // User cancelled or API error
      }
    },
    [isAvailable]
  );

  const stopCasting = useCallback(() => {
    if (connection) {
      connection.terminate();
      setConnection(null);
      setIsConnected(false);
    }
  }, [connection]);

  return { isAvailable, isConnected, startCasting, stopCasting };
}
