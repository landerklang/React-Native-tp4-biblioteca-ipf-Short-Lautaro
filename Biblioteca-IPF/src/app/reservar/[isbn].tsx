import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { LIBROS } from "../../data/libros";
import { useBiblioteca } from "../../context/BibliotecaContext";
import { TEMA } from "../../constants/tema";
import { Boton } from "../../components/Boton";

export default function ReservarScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const router = useRouter();
  const { prestamos, agregarPrestamo, esperas, unirseEspera } = useBiblioteca();

  const libro = LIBROS.find((l) => l.isbn === isbn);
  const yaPrestado = prestamos.some((p) => p.isbn === isbn);
  const colaActual = esperas[isbn || ""];
  const enEspera = colaActual?.aArray().includes("Yo");
  const posicionEspera = colaActual?.aArray().indexOf("Yo");

  if (!libro) return <Text>Libro no encontrado</Text>;

  const confirmar = () => {
    if (libro.ejemplares > 0) {
      agregarPrestamo(libro.isbn);
    } else {
      unirseEspera(libro.isbn, "Yo");
    }
    // Navega a reservas y elimina esta pantalla del historial
    router.dismissTo("/reservas");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{libro.titulo}</Text>

      {yaPrestado ? (
        <Text style={styles.mensaje}>Ya tenés este libro en préstamo.</Text>
      ) : enEspera ? (
        <Text style={styles.mensaje}>
          Ya estás en la lista de espera. Posición:{" "}
          {posicionEspera !== undefined ? posicionEspera + 1 : "-"}
        </Text>
      ) : libro.ejemplares > 0 ? (
        <Text style={styles.mensaje}>
          Hay {libro.ejemplares} ejemplares disponibles. Préstamo por 7 días.
        </Text>
      ) : (
        <Text style={styles.mensaje}>
          No hay ejemplares. Al confirmar, entrarás a la lista de espera.
        </Text>
      )}

      <Boton
        titulo={
          libro.ejemplares > 0 ? "Confirmar Préstamo" : "Unirse a la espera"
        }
        onPress={confirmar}
        disabled={yaPrestado || enEspera}
      />
      <Boton
        titulo="Cancelar"
        variante="secundario"
        onPress={() => router.back()}
        style={{ marginTop: TEMA.espaciados.md }}
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
  titulo: {
    fontSize: TEMA.tamanios.titulo,
    fontWeight: "bold",
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.md,
  },
  mensaje: {
    fontSize: TEMA.tamanios.texto,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.lg,
  },
});
