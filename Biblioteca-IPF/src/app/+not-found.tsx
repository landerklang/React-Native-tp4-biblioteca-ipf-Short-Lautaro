import { View, Text, StyleSheet } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { TEMA } from "../constants/tema";
import { Boton } from "../components/Boton";

export default function NotFoundScreen() {
  const ruta = usePathname();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Página no encontrada</Text>
      <Text style={styles.subtitulo}>
        La ruta <Text style={styles.ruta}>{ruta}</Text> no existe en la
        aplicación.
      </Text>
      <Boton
        titulo="Ir al Catálogo"
        onPress={() => router.replace("/")}
        style={{ marginTop: TEMA.espaciados.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: TEMA.espaciados.sm,
  },
  subtitulo: {
    fontSize: TEMA.tamanios.texto,
    color: TEMA.colores.textoSecundario,
    textAlign: "center",
    marginBottom: TEMA.espaciados.lg,
  },
  ruta: { fontWeight: "bold", color: TEMA.colores.error },
});
