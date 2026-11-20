import { useState, useEffect, useCallback } from "react";

export type EstadoPermiso =
  | "cargando"
  | "concedido"
  | "preguntable"
  | "bloqueado";

// Tipo base para lo que devuelven los hooks de Expo (como useCameraPermissions)
type RespuestaPermiso = {
  status: "granted" | "denied" | "undetermined";
  canAskAgain: boolean;
} | null;

export function usePermiso(
  hookPermiso: () => [RespuestaPermiso, () => Promise<RespuestaPermiso>],
) {
  // Ejecutamos el hook de Expo que nos pasaron (ej: useCameraPermissions)
  const [permiso, pedirPermiso] = hookPermiso();
  const [estado, setEstado] = useState<EstadoPermiso>("cargando");

  useEffect(() => {
    if (permiso === null || permiso === undefined) {
      setEstado("cargando");
    } else if (permiso.status === "granted") {
      setEstado("concedido");
    } else if (permiso.canAskAgain) {
      setEstado("preguntable");
    } else {
      // Si fue denegado y no se puede volver a preguntar, está bloqueado
      setEstado("bloqueado");
    }
  }, [permiso]);

  const solicitar = useCallback(async () => {
    try {
      const resultado = await pedirPermiso();
      return resultado?.status === "granted";
    } catch {
      return false;
    }
  }, [pedirPermiso]);

  return { estado, solicitar };
}
