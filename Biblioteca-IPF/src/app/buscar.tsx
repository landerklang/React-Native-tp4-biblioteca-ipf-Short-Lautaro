import { View, Text, StyleSheet } from "react-native";
import { TEMA } from "../constants/tema";

export default function BuscarScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Búsqueda</Text>
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
