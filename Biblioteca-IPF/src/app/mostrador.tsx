import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useBiblioteca } from "../context/BibliotecaContext";
import { LIBROS } from "../data/libros";
import { TEMA } from "../constants/tema";
import { Boton } from "../components/Boton";

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
                onPress={() => entregarAlSiguiente(isbn)}
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
