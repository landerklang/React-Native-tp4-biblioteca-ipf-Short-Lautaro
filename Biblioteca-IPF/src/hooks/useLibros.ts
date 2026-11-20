import { useState, useEffect, useCallback } from "react";
import { obtenerLibros } from "../lib/api";
import type { Libro } from "../types";

export function useLibros() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;

    setCargando(true);
    setError(null);

    obtenerLibros()
      .then((datos) => {
        if (!cancelado) {
          setLibros(datos);
          setCargando(false);
        }
      })
      .catch(() => {
        if (!cancelado) {
          setError("No pudimos cargar el catálogo. Revisá tu conexión.");
          setCargando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [intento]);

  const reintentar = useCallback(() => {
    setIntento((n) => n + 1);
  }, []);

  return { libros, cargando, error, reintentar };
}
