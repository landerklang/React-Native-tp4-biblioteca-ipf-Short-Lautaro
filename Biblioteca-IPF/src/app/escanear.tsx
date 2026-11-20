import { useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { buscarLibros } from "../lib/api";
import { TEMA } from "../constants/tema";
import { TarjetaLibro } from "../components/TarjetaLibro";
import type { Libro } from "../types";

export default function BuscarScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const router = useRouter();

  const [texto, setTexto] = useState(q || "");
  const [resultados, setResultados] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efecto para la condición de carrera y el debounce (B2)
  useEffect(() => {
    // Si no hay búsqueda, limpiamos y salimos
    if (!q || q.trim() === "") {
      setResultados([]);
      setCargando(false);
      return;
    }

    let cancelado = false;
    setCargando(true);
    setError(null);

    // Usamos un pequeño delay (debounce) para no saturar la API
    const timer = setTimeout(() => {
      buscarLibros(q)
        .then((datos) => {
          if (!cancelado) {
            setResultados(datos);
            setCargando(false);
          }
        })
        .catch(() => {
          if (!cancelado) {
            setError("Error al buscar libros. Intentá de nuevo.");
            setCargando(false);
          }
        });
    }, 300);

    // LIMPIEZA: Si el usuario escribe otra letra antes de los 300ms o antes de que
    // llegue la respuesta, cancelamos el timer y marcamos el pedido como obsoleto.
    return () => {
      clearTimeout(timer);
      cancelado = true;
    };
  }, [q]);

  const handleCambioTexto = (nuevoTexto: string) => {
    setTexto(nuevoTexto);
    // Actualiza la URL sin apilar una nueva pantalla en el historial
    router.setParams({ q: nuevoTexto });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por título o autor..."
        value={texto}
        onChangeText={handleCambioTexto}
        autoFocus
        autoCorrect={false}
      />

      {cargando && <Text style={styles.info}>Buscando...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {!cargando && !error && q && resultados.length === 0 && (
        <Text style={styles.info}>
          No se encontraron resultados para "{q}".
        </Text>
      )}

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.isbn}
        renderItem={({ item }) => <TarjetaLibro libro={item} />}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TEMA.colores.fondo },
  input: {
    backgroundColor: TEMA.colores.fondoElemento,
    padding: TEMA.espaciados.md,
    fontSize: TEMA.tamanios.texto,
    borderBottomWidth: 1,
    borderBottomColor: TEMA.colores.borde,
  },
  lista: { padding: TEMA.espaciados.md },
  info: {
    textAlign: "center",
    color: TEMA.colores.textoSecundario,
    marginTop: TEMA.espaciados.md,
  },
  error: {
    textAlign: "center",
    color: TEMA.colores.error,
    marginTop: TEMA.espaciados.md,
  },
});
