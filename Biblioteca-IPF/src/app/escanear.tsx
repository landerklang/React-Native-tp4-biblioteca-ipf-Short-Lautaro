import { View, Text, StyleSheet } from "react-native";
import { TEMA } from "../constants/tema";

export default function EscanearScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Escanear</Text>
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
