import { View, Text, StyleSheet, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { usePermiso } from "../../hooks/usePermiso";
import { TEMA } from "../../constants/tema";
import { Boton } from "../../components/Boton";

export default function PermisosScreen() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const router = useRouter();

  // Usamos el hook de permisos que creamos antes
  const { estado, solicitar } = usePermiso(useCameraPermissions as any);
  // Nota: El "as any" es porque los tipos de Expo Camera son un poco estrictos,
  // pero el hook funciona igual.

  const esCamara = recurso === "camara";
  const beneficio = esCamara
    ? "Usamos tu cámara para leer el código de barras del libro y agilizar la reserva."
    : "Usamos tus notificaciones para avisarte cuando un libro esté por vencer o tengas uno disponible.";

  const handleContinuar = async () => {
    const concedido = await solicitar();
    if (concedido) {
      router.back(); // Si da permiso, vuelve a la pantalla que lo llamó
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Permiso de {recurso}</Text>
      <Text style={styles.beneficio}>{beneficio}</Text>

      {estado === "cargando" ? (
        <Text>Cargando estado del permiso...</Text>
      ) : estado === "bloqueado" ? (
        <Boton titulo="Abrir Ajustes" onPress={() => Linking.openSettings()} />
      ) : (
        <Boton titulo="Continuar" onPress={handleContinuar} />
      )}
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
