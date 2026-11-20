import { Stack } from "expo-router";
import {
  BibliotecaProvider,
  useBiblioteca,
} from "../context/BibliotecaContext";

function RootNavigator() {
  const { sesion } = useBiblioteca();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rutas públicas y de tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="buscar"
        options={{ headerShown: true, title: "Buscar" }}
      />
      <Stack.Screen
        name="escanear"
        options={{ headerShown: true, title: "Escanear" }}
      />
      <Stack.Screen
        name="reservar/[isbn]"
        options={{ presentation: "modal", title: "Reservar" }}
      />
      <Stack.Screen
        name="permisos/[recurso]"
        options={{ presentation: "modal", title: "Permisos" }}
      />

      {/* Rutas protegidas: Sin sesión */}
      <Stack.Protected guard={!sesion}>
        <Stack.Screen
          name="login"
          options={{ presentation: "modal", title: "Ingreso Personal" }}
        />
      </Stack.Protected>

      {/* Rutas protegidas: Con sesión */}
      <Stack.Protected guard={sesion}>
        <Stack.Screen
          name="mostrador"
          options={{ headerShown: true, title: "Mostrador" }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <BibliotecaProvider>
      <RootNavigator />
    </BibliotecaProvider>
  );
}
