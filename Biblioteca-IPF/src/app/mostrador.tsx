import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useBiblioteca } from "../context/BibliotecaContext";
import { LIBROS } from "../data/libros";
import { TEMA } from "../constants/tema";
import { Boton } from "../components/Boton";
import * as Notifications from "expo-notifications";
import { configurarCanalAndroid } from "../lib/notificaciones";

export default function MostradorScreen() {
  const { esperas, entregarAlSiguiente, cerrarSesion } = useBiblioteca();
  const router = useRouter();

  const librosConEspera = Object.entries(esperas).filter(
    ([_, cola]) => cola.tamanio > 0,
  );

  const handleCerrarSesion = () => {
    cerrarSesion();
    router.replace("/");
  };

  const handleEntregar = async (isbn: string) => {
    const persona = entregarAlSiguiente(isbn);

    if (persona === "Yo") {
      // Es el turno del alumno actual (simulado)
      const { status } = await Notifications.getPermissionsAsync();
      if (status === "granted") {
        // Si tiene permiso, disparamos notificación inmediata
        await configurarCanalAndroid();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "¡Tu libro está listo!",
            body: `El libro "${LIBROS.find((l) => l.isbn === isbn)?.titulo}" te está esperando en el mostrador.`,
          },
          trigger: null, // Inmediata
        });
      } else {
        // Si no tiene permiso, el aviso queda dentro de la app (en la pestaña reservas)
        // Para simular esto, podríamos tener un estado de "avisos" en el contexto.
        // Por ahora, lo dejamos como alerta visual en la app.
        console.log("Aviso en app: Tu libro está listo");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Mostrador</Text>
        <Boton
          titulo="Cerrar sesión"
          variante="peligro"
          onPress={handleCerrarSesion}
        />
      </View>

      <FlatList
        data={librosConEspera}
        keyExtractor={([isbn]) => isbn}
        renderItem={({ item: [isbn, cola] }) => {
          const libro = LIBROS.find((l) => l.isbn === isbn);
          const frente = cola.alFrente();
          return (
            <View style={styles.tarjeta}>
              <Text style={styles.tituloLibro}>
                {libro?.titulo || "Desconocido"}
              </Text>
              <Text>Al frente: {frente}</Text>
              <Text>En espera: {cola.tamanio}</Text>
              <Boton
                titulo="Entregar al siguiente"
                onPress={() => handleEntregar(isbn)}
                style={{ marginTop: TEMA.espaciados.sm }}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay libros con lista de espera.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: TEMA.espaciados.md,
    backgroundColor: TEMA.colores.fondo,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: TEMA.espaciados.lg,
  },
  titulo: {
    fontSize: TEMA.tamanios.titulo,
    fontWeight: "bold",
    color: TEMA.colores.texto,
  },
  tarjeta: {
    backgroundColor: TEMA.colores.fondoElemento,
    padding: TEMA.espaciados.md,
    borderRadius: TEMA.radios.md,
    marginBottom: TEMA.espaciados.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
  },
  tituloLibro: {
    fontSize: TEMA.tamanios.subtitulo,
    fontWeight: "bold",
    marginBottom: TEMA.espaciados.xs,
  },
  vacio: {
    textAlign: "center",
    color: TEMA.colores.textoSecundario,
    marginTop: TEMA.espaciados.xl,
  },
});
