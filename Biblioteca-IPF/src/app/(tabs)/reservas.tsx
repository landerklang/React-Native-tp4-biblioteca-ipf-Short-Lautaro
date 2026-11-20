import { View, Text, FlatList, StyleSheet, Switch } from "react-native";
import { useBiblioteca } from "../../context/BibliotecaContext";
import { LIBROS } from "../../data/libros";
import { TEMA } from "../../constants/tema";
import { Boton } from "../../components/Boton";

export default function ReservasScreen() {
  const { prestamos, devolverPrestamo, toggleRecordatorio, esperas } =
    useBiblioteca();

  // Filtrar las listas de espera donde estoy anotado ('Yo')
  const misEsperas = Object.entries(esperas)
    .map(([isbn, cola]) => {
      const posicion = cola.aArray().indexOf("Yo");
      return { isbn, posicion: posicion !== -1 ? posicion + 1 : -1 };
    })
    .filter((e) => e.posicion > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.seccionTitulo}>Mis Préstamos</Text>

      <FlatList
        data={prestamos}
        keyExtractor={(item) => item.isbn}
        renderItem={({ item }) => {
          const libro = LIBROS.find((l) => l.isbn === item.isbn);
          const fecha = new Date(item.fechaDevolucion).toLocaleDateString();

          return (
            <View style={styles.tarjeta}>
              <Text style={styles.tituloLibro}>{libro?.titulo}</Text>
              <Text style={styles.texto}>Devolver antes del: {fecha}</Text>

              <View style={styles.filaRecordatorio}>
                <Text style={styles.texto}>Recordarme</Text>
                <Switch
                  value={item.recordar}
                  onValueChange={() => toggleRecordatorio(item.isbn)}
                  trackColor={{
                    false: TEMA.colores.borde,
                    true: TEMA.colores.primario,
                  }}
                />
              </View>

              <Boton
                titulo="Devolver"
                variante="peligro"
                onPress={() => devolverPrestamo(item.isbn)}
                style={{ marginTop: TEMA.espaciados.sm }}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.vacio}>No tenés préstamos activos.</Text>
        }
      />

      <Text style={[styles.seccionTitulo, { marginTop: TEMA.espaciados.xl }]}>
        Reservas en espera
      </Text>

      <FlatList
        data={misEsperas}
        keyExtractor={(item) => item.isbn}
        renderItem={({ item }) => {
          const libro = LIBROS.find((l) => l.isbn === item.isbn);
          return (
            <View style={styles.tarjeta}>
              <Text style={styles.tituloLibro}>{libro?.titulo}</Text>
              <Text style={styles.texto}>
                Posición en la fila: {item.posicion}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.vacio}>No estás en ninguna lista de espera.</Text>
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
  seccionTitulo: {
    fontSize: TEMA.tamanios.subtitulo,
    fontWeight: "bold",
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.md,
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
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.xs,
  },
  texto: { fontSize: TEMA.tamanios.texto, color: TEMA.colores.textoSecundario },
  filaRecordatorio: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: TEMA.espaciados.md,
    marginBottom: TEMA.espaciados.sm,
  },
  vacio: {
    color: TEMA.colores.textoSecundario,
    fontStyle: "italic",
    marginBottom: TEMA.espaciados.md,
  },
});
