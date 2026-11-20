import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useBiblioteca } from "../context/BibliotecaContext";
import { TEMA } from "../constants/tema";
import { Boton } from "../components/Boton";

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const { iniciarSesion } = useBiblioteca();
  const router = useRouter();

  const handleLogin = () => {
    if (usuario === "admin" && clave === "1234") {
      iniciarSesion();
      router.replace("/mostrador");
    } else {
      setError("Usuario o clave incorrectos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ingreso Personal</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Clave"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
      />

      <Boton titulo="Ingresar" onPress={handleLogin} />
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
    marginBottom: TEMA.espaciados.lg,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    borderRadius: TEMA.radios.sm,
    padding: TEMA.espaciados.md,
    marginBottom: TEMA.espaciados.md,
    backgroundColor: TEMA.colores.fondoElemento,
  },
  error: {
    color: TEMA.colores.error,
    marginBottom: TEMA.espaciados.md,
    textAlign: "center",
  },
});
