import { Pressable, Text, StyleSheet, PressableProps } from "react-native";
import { TEMA } from "../constants/tema";

type BotonProps = PressableProps & {
  titulo: string;
  variante?: "primario" | "peligro" | "secundario";
};

export function Boton({ titulo, variante = "primario", ...props }: BotonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.boton,
        styles[variante],
        pressed && styles.presionado,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.texto,
          variante === "secundario" && styles.textoSecundario,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: TEMA.tamanios.botonMinimo,
    paddingHorizontal: TEMA.espaciados.md,
    paddingVertical: TEMA.espaciados.sm,
    borderRadius: TEMA.radios.md,
    justifyContent: "center",
    alignItems: "center",
  },
  primario: {
    backgroundColor: TEMA.colores.primario,
  },
  peligro: {
    backgroundColor: TEMA.colores.error,
  },
  secundario: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
  },
  presionado: {
    opacity: 0.7,
  },
  texto: {
    color: "#FFFFFF",
    fontSize: TEMA.tamanios.texto,
    fontWeight: "bold",
  },
  textoSecundario: {
    color: TEMA.colores.texto,
  },
});
