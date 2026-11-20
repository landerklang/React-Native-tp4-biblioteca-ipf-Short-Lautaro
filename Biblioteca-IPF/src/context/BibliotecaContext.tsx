import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Pila } from "../estructuras/Pila";
import { Cola } from "../estructuras/Colas";
import { ESPERAS_INICIALES } from "../data/libros";
import type { Libro } from "../types";

export type Prestamo = {
  isbn: string;
  fechaDevolucion: string;
  recordar: boolean;
  notificacionId?: string;
};

type BibliotecaContextType = {
  // Vistos recientemente
  recientes: Libro[];
  agregarReciente: (libro: Libro) => void;

  // Préstamos
  prestamos: Prestamo[];
  agregarPrestamo: (isbn: string) => void;
  devolverPrestamo: (isbn: string) => void;
  toggleRecordatorio: (isbn: string) => void;
  setNotificacionId: (isbn: string, id: string) => void;

  // Listas de espera
  esperas: Record<string, Cola<string>>;
  unirseEspera: (isbn: string, nombre: string) => void;
  entregarAlSiguiente: (isbn: string) => string | undefined;

  // Sesión
  sesion: boolean;
  iniciarSesion: () => void;
  cerrarSesion: () => void;
};

const BibliotecaContext = createContext<BibliotecaContextType | null>(null);

// Nombre simulado del alumno actual
const NOMBRE_ALUMNO = "Yo";

export function BibliotecaProvider({ children }: { children: ReactNode }) {
  // --- Recientes (Pila) ---
  const [pilaRecientes, setPilaRecientes] = useState<Pila<Libro>>(
    () => new Pila<Libro>(),
  );

  const agregarReciente = useCallback((libro: Libro) => {
    setPilaRecientes((pilaVieja) => {
      const arrayViejo = pilaVieja.aArray();
      // Si ya está en el tope, no hacemos nada
      if (
        arrayViejo.length > 0 &&
        arrayViejo[arrayViejo.length - 1].isbn === libro.isbn
      ) {
        return pilaVieja;
      }
      const nuevaPila = new Pila<Libro>();
      arrayViejo.forEach((l) => nuevaPila.apilar(l));
      nuevaPila.apilar(libro);
      return nuevaPila;
    });
  }, []);

  const recientes = pilaRecientes.aArray().reverse().slice(0, 3); // Más recientes primero, top 3

  // --- Préstamos ---
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);

  const agregarPrestamo = useCallback((isbn: string) => {
    setPrestamos((prev) => {
      if (prev.some((p) => p.isbn === isbn)) return prev;
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + 7);
      return [
        ...prev,
        { isbn, fechaDevolucion: fecha.toISOString(), recordar: false },
      ];
    });
  }, []);

  const devolverPrestamo = useCallback((isbn: string) => {
    setPrestamos((prev) => prev.filter((p) => p.isbn !== isbn));
  }, []);

  const toggleRecordatorio = useCallback((isbn: string) => {
    setPrestamos((prev) =>
      prev.map((p) => (p.isbn === isbn ? { ...p, recordar: !p.recordar } : p)),
    );
  }, []);

  const setNotificacionId = useCallback((isbn: string, id: string) => {
    setPrestamos((prev) =>
      prev.map((p) => (p.isbn === isbn ? { ...p, notificacionId: id } : p)),
    );
  }, []);

  // --- Listas de espera ---
  const [esperas, setEsperas] = useState<Record<string, Cola<string>>>(() => {
    const iniciales: Record<string, Cola<string>> = {};
    Object.entries(ESPERAS_INICIALES).forEach(([isbn, personas]) => {
      const cola = new Cola<string>();
      personas.forEach((p) => cola.encolar(p));
      iniciales[isbn] = cola;
    });
    return iniciales;
  });

  const unirseEspera = useCallback((isbn: string, nombre: string) => {
    setEsperas((prev) => {
      const nuevaCola = new Cola<string>();
      prev[isbn]?.aArray().forEach((p) => nuevaCola.encolar(p));
      nuevaCola.encolar(nombre);
      return { ...prev, [isbn]: nuevaCola };
    });
  }, []);

  const entregarAlSiguiente = useCallback((isbn: string) => {
    let personaEntregada: string | undefined;
    setEsperas((prev) => {
      if (!prev[isbn] || prev[isbn].tamanio === 0) return prev;
      const nuevaCola = new Cola<string>();
      prev[isbn].aArray().forEach((p) => nuevaCola.encolar(p));
      personaEntregada = nuevaCola.desencolar();
      return { ...prev, [isbn]: nuevaCola };
    });
    return personaEntregada;
  }, []);

  // --- Sesión ---
  const [sesion, setSesion] = useState(false);
  const iniciarSesion = useCallback(() => setSesion(true), []);
  const cerrarSesion = useCallback(() => setSesion(false), []);

  return (
    <BibliotecaContext.Provider
      value={{
        recientes,
        agregarReciente,
        prestamos,
        agregarPrestamo,
        devolverPrestamo,
        toggleRecordatorio,
        setNotificacionId,
        esperas,
        unirseEspera,
        entregarAlSiguiente,
        sesion,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </BibliotecaContext.Provider>
  );
}

export function useBiblioteca() {
  const contexto = useContext(BibliotecaContext);
  if (!contexto) {
    throw new Error(
      "useBiblioteca debe usarse dentro de un BibliotecaProvider",
    );
  }
  return contexto;
}
