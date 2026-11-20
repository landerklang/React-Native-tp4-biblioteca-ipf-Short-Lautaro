import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { TEMA } from "../../constants/tema";

export default function DetalleLibroScreen() {
  const { isbn } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Detalle del libro: {isbn}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: TEMA.colores.fondo,
  },
});
