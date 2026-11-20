import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TEMA } from "../../constants/tema";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TEMA.colores.primario,
        tabBarInactiveTintColor: TEMA.colores.textoSecundario,
        headerShown: false, // Los headers los maneja el Stack interno
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Catálogo",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="library-outline"
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: "Mis Reservas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="library-outline"
              size={size}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}
