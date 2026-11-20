import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { LIBROS } from "../../data/libros";
import { useBiblioteca } from "../../context/BibliotecaContext";
import { TEMA } from "../../constants/tema";
import { Boton } from "../../components/Boton";

export default function DetalleLibroScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const router = useRouter();
  const { agregarReciente } = useBiblioteca();

  // Validación de ISBN (A3.4)
  const isbnValido = isbn && isbn.length === 13 && /^\d+$/.test(isbn);
  const libro = LIBROS.find((l) => l.isbn === isbn);

  useEffect(() => {
    if (libro) {
      agregarReciente(libro);
    }
  }, [libro, agregarReciente]);

  if (!isbnValido || !libro) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>
          El ISBN no es válido o el libro no existe.
        </Text>
        <Boton
          titulo="Volver al Catálogo"
          onPress={() => router.replace("/")}
          style={{ marginTop: TEMA.espaciados.md }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{libro.titulo}</Text>
      <Text style={styles.autor}>{libro.autor}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTexto}>Año: {libro.anio}</Text>
        <Text style={styles.infoTexto}>ISBN: {libro.isbn}</Text>
        <Text style={styles.infoTexto}>
          Ejemplares disponibles: {libro.ejemplares}
        </Text>
      </View>

      <Boton
        titulo="Reservar"
        onPress={() => router.push(`/reservar/${libro.isbn}`)}
        style={{ marginTop: TEMA.espaciados.xl }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: TEMA.espaciados.lg,
    backgroundColor: TEMA.colores.fondo,
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: TEMA.espaciados.lg,
    backgroundColor: TEMA.colores.fondo,
  },
  titulo: {
    fontSize: TEMA.tamanios.titulo,
    fontWeight: "bold",
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.xs,
  },
  autor: {
    fontSize: TEMA.tamanios.subtitulo,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.lg,
  },
  infoContainer: {
    backgroundColor: TEMA.colores.fondoElemento,
    padding: TEMA.espaciados.md,
    borderRadius: TEMA.radios.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    gap: TEMA.espaciados.sm,
  },
  infoTexto: { fontSize: TEMA.tamanios.texto, color: TEMA.colores.texto },
  error: {
    color: TEMA.colores.error,
    fontSize: TEMA.tamanios.texto,
    textAlign: "center",
  },
});
