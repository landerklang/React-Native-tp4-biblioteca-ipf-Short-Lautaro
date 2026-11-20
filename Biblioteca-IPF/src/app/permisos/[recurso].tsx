import { View, Text, StyleSheet, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { TEMA } from "../../constants/tema";
import { Boton } from "../../components/Boton";

export default function PermisosScreen() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  const esCamara = recurso === "camara";
  const beneficio = esCamara
    ? "Usamos tu cámara para leer el código de barras del libro y agilizar la reserva."
    : "Usamos tus notificaciones para avisarte cuando un libro esté por vencer o tengas uno disponible.";

  const abrirAjustes = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Permiso de {recurso}</Text>
      <Text style={styles.beneficio}>{beneficio}</Text>

      {/* En la lógica real de D1, acá verificaríamos si está bloqueado o preguntable */}
      <Boton titulo="Continuar" onPress={() => console.log("Pedir permiso")} />
      <Boton
        titulo="Abrir Ajustes"
        variante="secundario"
        onPress={abrirAjustes}
        style={{ marginTop: TEMA.espaciados.md }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: TEMA.espaciados.lg,
    justifyContent: "center",
    backgroundColor: TEMA.colores.fondo,
  },
  titulo: {
    fontSize: TEMA.tamanios.titulo,
    fontWeight: "bold",
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.md,
    textTransform: "capitalize",
  },
  beneficio: {
    fontSize: TEMA.tamanios.texto,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.lg,
    lineHeight: 24,
  },
});
