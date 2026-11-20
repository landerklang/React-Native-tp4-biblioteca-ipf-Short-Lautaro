import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useLibros } from "../../hooks/useLibros";
import { useBiblioteca } from "../../context/BibliotecaContext";
import { TEMA } from "../../constants/tema";
import { Boton } from "../../components/Boton";
import { TarjetaLibro } from "../../components/TarjetaLibro";
import { Ionicons } from "@expo/vector-icons";

export default function CatalogoScreen() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { recientes } = useBiblioteca();
  const router = useRouter();

  return (
    <View style={styles.contenedor}>
      {/* Header con accesos */}
      <View style={styles.header}>
        <Text style={styles.tituloHeader}>Biblioteca IPF</Text>
        <View style={styles.accionesHeader}>
          <Link href="/buscar" asChild>
            <Boton
              titulo="Buscar"
              variante="secundario"
              style={styles.botonHeader}
            />
          </Link>
          <Link href="/escanear" asChild>
            <Boton
              titulo="Escanear"
              variante="secundario"
              style={styles.botonHeader}
            />
          </Link>
        </View>
      </View>

      {/* Vistos recientemente */}
      {recientes.length > 0 && (
        <View style={styles.seccionRecientes}>
          <Text style={styles.tituloSeccion}>Vistos recientemente</Text>
          <View style={styles.listaRecientes}>
            {recientes.map((libro) => (
              <TarjetaLibro key={`rec-${libro.isbn}`} libro={libro} />
            ))}
          </View>
        </View>
      )}

      {/* Lista principal de libros */}
      <Text style={[styles.tituloSeccion, { marginTop: TEMA.espaciados.md }]}>
        Catálogo completo
      </Text>

      {cargando ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={TEMA.colores.primario} />
          <Text style={styles.textoCargando}>Cargando catálogo...</Text>
        </View>
      ) : error ? (
        <View style={styles.centrado}>
          <Text style={styles.textoError}>{error}</Text>
          <Boton
            titulo="Reintentar"
            onPress={reintentar}
            style={{ marginTop: TEMA.espaciados.md }}
          />
        </View>
      ) : (
        <FlatList
          data={libros}
          keyExtractor={(item) => item.isbn}
          renderItem={({ item }) => <TarjetaLibro libro={item} />}
          contentContainerStyle={styles.listaContenido}
          ListEmptyComponent={
            <Text style={styles.textoVacio}>No hay libros en el catálogo.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: TEMA.colores.fondo,
  },
  header: {
    padding: TEMA.espaciados.md,
    backgroundColor: TEMA.colores.fondoElemento,
    borderBottomWidth: 1,
    borderBottomColor: TEMA.colores.borde,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tituloHeader: {
    fontSize: TEMA.tamanios.titulo,
    fontWeight: "bold",
    color: TEMA.colores.primario,
  },
  accionesHeader: {
    flexDirection: "row",
    gap: TEMA.espaciados.sm,
  },
  botonHeader: {
    minHeight: 36, // Un poco más chico para el header
    paddingHorizontal: TEMA.espaciados.sm,
  },
  seccionRecientes: {
    padding: TEMA.espaciados.md,
    backgroundColor: TEMA.colores.fondo,
  },
  tituloSeccion: {
    fontSize: TEMA.tamanios.subtitulo,
    fontWeight: "bold",
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.sm,
  },
  listaRecientes: {
    gap: TEMA.espaciados.sm,
  },
  listaContenido: {
    padding: TEMA.espaciados.md,
    paddingBottom: TEMA.espaciados.xl,
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: TEMA.espaciados.xl,
  },
  textoCargando: {
    marginTop: TEMA.espaciados.md,
    color: TEMA.colores.textoSecundario,
    fontSize: TEMA.tamanios.texto,
  },
  textoError: {
    color: TEMA.colores.error,
    fontSize: TEMA.tamanios.texto,
    textAlign: "center",
  },
  textoVacio: {
    textAlign: "center",
    color: TEMA.colores.textoSecundario,
    marginTop: TEMA.espaciados.lg,
  },
});
