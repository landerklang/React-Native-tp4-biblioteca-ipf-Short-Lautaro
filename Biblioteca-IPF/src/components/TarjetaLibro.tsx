import { Pressable, Text, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { TEMA } from "../constants/tema";
import type { Libro } from "../types";

export function TarjetaLibro({ libro }: { libro: Libro }) {
  return (
    <Link href={`/libro/${libro.isbn}`} asChild>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.tarjeta, pressed && styles.presionado]}
      >
        <View style={styles.contenido}>
          <Text style={styles.titulo} numberOfLines={1}>
            {libro.titulo}
          </Text>
          <Text style={styles.autor}>{libro.autor}</Text>
          <Text style={styles.disponibilidad}>
            {libro.ejemplares > 0
              ? `${libro.ejemplares} disponibles`
              : "Sin ejemplares"}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: TEMA.colores.fondoElemento,
    borderRadius: TEMA.radios.md,
    padding: TEMA.espaciados.md,
    marginBottom: TEMA.espaciados.sm,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
  },
  presionado: {
    opacity: 0.7,
  },
  contenido: {
    gap: TEMA.espaciados.xs,
  },
  titulo: {
    fontSize: TEMA.tamanios.subtitulo,
    fontWeight: "bold",
    color: TEMA.colores.texto,
  },
  autor: {
    fontSize: TEMA.tamanios.texto,
    color: TEMA.colores.textoSecundario,
  },
  disponibilidad: {
    fontSize: TEMA.tamanios.pequenio,
    color: TEMA.colores.primario,
    fontWeight: "600",
    marginTop: TEMA.espaciados.xs,
  },
});
