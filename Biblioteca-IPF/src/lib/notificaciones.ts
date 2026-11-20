import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configuramos cómo se comporta la notificación si la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function configurarCanalAndroid() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("prestamos", {
      name: "Préstamos y Reservas",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2563EB",
    });
  }
}

export async function programarNotificacion(titulo: string, cuerpo: string) {
  return await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: cuerpo },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 15, // Modo demostración: 15 segundos
    },
  });
}

export async function cancelarNotificacion(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
