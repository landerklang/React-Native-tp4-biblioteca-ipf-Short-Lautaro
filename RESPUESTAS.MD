# RESPUESTAS.md — TP4 Biblioteca IPF

## Parte B · Estado, efectos y renderizado

### B1. El ciclo de vida de `useLibros`

**a)** En `src/hooks/useLibros.ts`, al montar el Catálogo ocurren 2 renders principales:

1. **Render 1 (inicial):** `libros=[]`, `cargando=true`, `error=null`. Ocurre porque los estados iniciales están configurados así en el hook.
2. **Render 2 (resolución):** Cuando la promesa `obtenerLibros()` se resuelve, el `.then` ejecuta `setLibros(datos)` y `setCargando(false)`. Esto provoca el segundo render donde `libros` tiene los 15 libros, `cargando` es `false` y `error` sigue `null`.

Si `obtenerLibros()` falla, el `.catch` ejecuta `setError('No pudimos cargar el catálogo...')` y `setCargando(false)`. La pantalla muestra el mensaje de error y el botón "Reintentar". Al tocarlo, `reintentar()` incrementa el estado `intento` de 0 a 1. Esto dispara el re-render y vuelve a ejecutar el `useEffect` (porque `intento` está en el array de dependencias). En ese momento el render muestra `cargando=true` y `error=null` nuevamente, hasta que la promesa se resuelva o falle.

**b)** El Catálogo **no** se desmonta cuando la persona cambia a la pestaña "Mis reservas" ni cuando abre un detalle. Esto se debe a cómo funciona el navegador de pestañas y el Stack: las pantallas de las Tabs se mantienen montadas para no perder su estado, y al abrir un detalle, se apila una nueva pantalla sobre la actual sin destruir la anterior.
La limpieza del efecto (el `cancelado = true` en el `return`) se ejecuta en situaciones reales como:

- Cuando el componente se desmonta definitivamente (por ejemplo, si se cierra la app o se reinicia el flujo de navegación).
- Cuando cambia la dependencia `[intento]` (al presionar "Reintentar"), porque React ejecuta la limpieza del efecto anterior antes de correr el nuevo.

**c)** No se puede pasar una función `async` directamente a `useEffect` porque `useEffect` espera que la función devuelva una función de limpieza (o `undefined`). Una función `async` siempre devuelve una Promesa, y React no sabe qué hacer con esa promesa como valor de retorno, lo que genera un error.
Lo resolví ejecutando la promesa dentro de un `.then().catch()` estándar, sin marcar el callback del efecto como `async`.

**d)** `reintentar` está implementado como `const reintentar = useCallback(() => setIntento((n) => n + 1), [])`. Al ejecutarse, cambia el estado `intento`. El efecto se vuelve a ejecutar porque `intento` está en su array de dependencias `[intento]`. Elegí `intento` y no otra variable porque funciona como un "disparador" (trigger) numérico: no necesito que el efecto dependa del estado de los libros o del error (eso causaría un bucle infinito de peticiones), solo necesito un valor que cambie cuando el usuario pide reintentar explícitamente.

### B2. La condición de carrera del buscador

**Tabla de momentos:**
| Momento | Qué pasa | Sin limpieza: qué se ve | Con tu código: qué se ve |
| :--- | :--- | :--- | :--- |
| t=0 ms | Escribe "bor" → pide `buscarLibros("bor")` (tarda 1.400 ms). | "Buscando..." | "Buscando..." |
| t=200 ms | Escribe "borges" → pide `buscarLibros("borges")` (tarda 300 ms). | "Buscando..." | "Buscando..." |
| t=500 ms | Llega la respuesta de "borges". | Resultados de "borges". | Resultados de "borges". |
| t=1.400 ms | Llega la respuesta de "bor". | Resultados de "bor" (pisa los de "borges"). | Resultados de "borges" (la respuesta vieja se descarta). |

**a)** La limpieza de mi efecto (`return () => { clearTimeout(timer); cancelado = true; }`) hace dos cosas: cancela el temporizador del debounce si el usuario sigue escribiendo y, fundamentalmente, cambia la variable local `cancelado` a `true`. Cuando la promesa vieja (la de "bor") finalmente se resuelve, el `.then()` evalúa `if (!cancelado)`. Como la limpieza ya se ejecutó al cambiar `q`, `cancelado` es `true` y el código no ejecuta `setResultados`, descartando la respuesta obsoleta. La limpieza se ejecuta exactamente **antes** de que el efecto vuelva a correr por un cambio en la dependencia `q` (cada vez que el usuario tipea).

**b)** La solución del compañero **no funciona** en el contexto de React por cómo funcionan las clausuras (closures). La función `.then()` "recuerda" el valor de `q` en el momento en que se creó. Cuando llega la respuesta de "borges" en `t=500 ms`, `texto` vale "borges" y `q` (el valor actual en ese render) también, por lo que pasa el `if` y setea los resultados. Pero cuando llega la respuesta de "bor" en `t=1400 ms`, el `texto` de esa clausura sigue siendo "bor", y `q` en el estado actual de React ya es "borges", por lo que la condición falla (lo cual está bien), pero el problema es que si el usuario vuelve a escribir "bor" en el futuro, el valor actual de `q` podría coincidir por casualidad y pisar los resultados actuales con los de la clausura vieja. Además, el estado `q` dentro de la clausura del `.then` está "congelado" en el valor del render que lo creó. La variable `cancelado` es más segura porque su referencia se actualiza directamente en la limpieza del efecto, sin depender del valor de los parámetros.

**c)** Mientras la persona escribe, la URL cambia constantemente (por `router.setParams`). El botón "atrás" del celular no vuelve a la pantalla anterior letra por letra, sino que va a la pantalla de origen (el Catálogo), porque `setParams` reemplaza la entrada actual en el historial, no apila una nueva. Si hubiera usado `router.push`, cada letra que escriba el usuario crearía una nueva pantalla de búsqueda en la pila, y tocar "atrás" requeriría presionar el botón 5 o 6 veces para salir del buscador (una por cada letra escrita).

### B3. Mutar o reemplazar

**a)** La persona toca "Anotarme" tres veces. El texto sigue mostrando `0` (o el valor inicial). Esto pasa porque la clase `Cola` muta su estado interno (`#items`), pero React no se entera de ese cambio. React solo vuelve a renderizar un componente cuando cambia un estado de React (`useState`). Al mutar la instancia de la cola, la referencia del objeto sigue siendo la misma, por lo que no se dispara el re-render.

**b)** Cuando la persona escribe en el `TextInput`, se dispara un `setState` (porque el input es controlado). Eso fuerza a React a re-renderizar el componente completo. En ese nuevo render, React evalúa `{espera.tamanio}` y, como la cola ya había mutado silenciosamente 3 veces, ahora muestra el número `3`.
Un error que aparece "a veces" es peor que uno que aparece siempre porque es muy difícil de depurar: depende de acciones no relacionadas (como escribir en un input) para manifestarse. Un error constante se detecta inmediatamente en el desarrollo, mientras que uno intermitente puede llegar a producción.

**c)** En mi Context resuelvo esto creando una **nueva instancia** de `Cola` en cada actualización y usando `setEsperas` con el estado anterior. Ejemplo:

```typescript
const nuevaCola = new Cola<string>();
prev[isbn]?.aArray().forEach((p) => nuevaCola.encolar(p));
nuevaCola.encolar(nombre);
return { ...prev, [isbn]: nuevaCola };
```

### B4. ¿Dónde vive cada dato?

Para cada dato, indicá dónde vive en tu app (estado local, Context, URL, sistema operativo o se calcula) y justificá por qué ahí y no en otro lugar.

| Dato                             | Dónde vive en tu app                                                         | Por qué ahí y no en otro lugar                                                                                                                 |
| :------------------------------- | :--------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| Texto del buscador               | En la URL (q) y en un estado local (texto) para el input.                    | La URL permite compartir la búsqueda y persistirla. El estado local es necesario para reflejar el texto mientras se escribe.                   |
| Préstamos y reservas             | En el BibliotecaContext.                                                     | Son datos globales que afectan a varias pantallas (Catálogo, Reservas, Mostrador). Si estuvieran en local, se perderían al cambiar de pestaña. |
| Listas de espera                 | En el BibliotecaContext.                                                     | Igual que los préstamos. Además, el Mostrador necesita modificarlas y la pantalla de Reservas necesita leerlas.                                |
| Vistos recientemente             | En el BibliotecaContext (usando la clase Pila).                              | Debe sobrevivir a la navegación entre pantallas para mostrarse en el Catálogo sin perder los datos.                                            |
| Sesión del personal              | En el BibliotecaContext.                                                     | Es un estado global que controla el acceso a la pantalla de Mostrador (Stack.Protected) y se modifica en el Login.                             |
| Ejemplares disponibles           | En el data/libros.ts y se calcula en base a los préstamos (en una app real). | Es el dato fuente (semilla). En este TP, los ejemplares iniciales son estáticos, pero lógicamente debería calcularse.                          |
| Estado del permiso de cámara     | En el hook usePermiso (estado local de la pantalla que lo usa).              | Es efímero y solo le importa a la pantalla que está pidiendo el permiso en ese momento.                                                        |
| Identificador de la notificación | En el estado del BibliotecaContext (dentro de cada objeto Prestamo).         | Se necesita a nivel global para que la pantalla de Reservas pueda cancelarla si se desactiva el switch o se devuelve el libro.                 |

¿Qué pasa cuando cambia el value del Context?
Cuando cambia el value, todos los componentes que consumen el contexto a través de useBiblioteca() se vuelven a renderizar, incluso si solo usan una parte del estado.
Sí, el Catálogo se re-renderiza al activar un recordatorio en otra pestaña, porque está suscripto al contexto.
Para evitarlo, podríamos dividir el Context en varios (por ejemplo, ContextoPrestamos, ContextoRecientes, ContextoSesion), o usar librerías de manejo de estado como Zustand que permiten suscripciones selectivas. En una app de este tamaño (solo 3 pantallas principales), no vale la pena: el re-render es muy barato y agregar más contextos solo haría el código más difícil de leer.

## Parte C · Navegación, Escáner y Deep Links

### C1. La pila en tu app

_(Nota: Asumo que el detalle del libro se abre en el Stack raíz, tal como está configurado en el `_layout.tsx` actual)._

| #   | Acción                      | Pilas resultantes (Stack Raíz)                      |
| :-- | :-------------------------- | :-------------------------------------------------- |
| 1   | Abre la app.                | `[ (tabs) ]` (Pestaña Catálogo activa)              |
| 2   | Toca un libro del Catálogo. | `[ (tabs), libro/[isbn] ]`                          |
| 3   | Toca "Reservar".            | `[ (tabs), libro/[isbn], reservar/[isbn] ]` (Modal) |
| 4   | Toca "Confirmar".           | `[ (tabs) ]` (Pestaña Reservas activa)              |
| 5   | Toca atrás (Android).       | `[ (tabs) ]` (Pestaña Catálogo activa)              |
| 6   | Toca la tab "Catálogo".     | `[ (tabs) ]` (Pestaña Catálogo activa)              |

**a)** En el paso 4 usé el método `router.dismissTo('/reservas')`.

- Si hubiera usado `push`: La pantalla de confirmación se apilaría sobre el detalle, y al tocar "atrás" volverías a la confirmación del préstamo (lo cual no tiene sentido, porque ya reservaste).
- Si hubiera usado `replace`: Reemplazaría la pantalla de confirmación por la de reservas, pero el detalle del libro y la pantalla de reservar seguirían en la pila de abajo (el botón atrás te devolvería al detalle del libro).
- Elegí `dismissTo` porque descarta todas las pantallas modales y de detalle que están por encima, y te lleva directamente a la pestaña de Reservas, limpiando el historial de navegación.

**b)** En el paso 6, la persona ve el **Catálogo**. Esto pasa porque las pestañas (Tabs) mantienen su propio estado interno. Si bien el usuario navegó a Reservas, la pestaña de Catálogo no se desmontó; al volver a tocarla, muestra la pantalla que estaba en su tope (el Catálogo). Me parece el comportamiento correcto para esta app: es frustrante para un usuario que, al tocar el ícono principal de la app, lo devuelva a la pantalla de reservas en la que estaba hace 10 minutos.

### C2. El escáner que dispara de más

**a)** Si dentro de `onBarcodeScanned` llamáramos a `router.push` sin protección, la cámara leería el mismo código 10 o 15 veces por segundo. Esto apilaría decenas de pantallas de detalle una arriba de otra. Al tocar "atrás", el usuario tendría que retroceder por todas esas pantallas duplicadas, colapsando la memoria del teléfono (relacionado con la cola de acciones del TP 2: se encolan múltiples acciones idénticas).

**b)** Usé `useRef` (con la variable `yaEscaneado`). Un `useState` no alcanza porque los cambios de estado en React son **asíncronos**. Si el escáner dispara 5 veces en 100 milisegundos, las 5 veces leerán que la variable de estado sigue siendo `false` (porque React todavía no procesó el re-render), y se ejecutarán las 5 navegaciones. El `useRef` es **síncrono**: cuando hago `yaEscaneado.current = true`, el valor cambia inmediatamente en memoria, por lo que el siguiente disparo (milisegundos después) ya lee `true` y se frena.

**c)** Conviene usar `replace` para que la pantalla del escáner desaparezca de la pila y sea reemplazada por la del detalle. Si usara `push`, al tocar "atrás" desde el detalle del libro, la cámara se volvería a abrir, lo cual es una mala experiencia (obligás al usuario a escanear de nuevo para salir).

**d)** Si el ISBN no está en el catálogo, la app muestra un mensaje de error en la misma pantalla y libera el bloqueo del escáner usando un `setTimeout` de 2 segundos para volver a poner `yaEscaneado.current = false`. Esto evita que el mismo aviso aparezca diez veces seguidas, pero permite al usuario seguir escaneando si agarra otro libro.

### C3. Deep links y rutas protegidas

| Link                                          | Qué ve la persona                                                           | Qué queda debajo en la pila                 | Qué parte de tu código lo decide                           |
| :-------------------------------------------- | :-------------------------------------------------------------------------- | :------------------------------------------ | :--------------------------------------------------------- |
| `bibliotecaipf://libro/` + ISBN existente     | Pantalla de detalle con toda la info del libro.                             | El Stack raíz con las pestañas.             | `src/app/libro/[isbn].tsx` y la validación del ISBN.       |
| `bibliotecaipf://libro/123`                   | Mensaje de error: "El ISBN no es válido o no existe" con botón al Catálogo. | El Stack raíz con las pestañas.             | `src/app/libro/[isbn].tsx` (validación de 13 dígitos).     |
| `bibliotecaipf://buscar?q=borges`             | El buscador abierto con los resultados de "borges".                         | El Stack raíz (las pestañas quedan debajo). | `src/app/buscar.tsx` y la prop `anchor` en el layout.      |
| `bibliotecaipf://mostrador` (sin sesión)      | La app redirige a la pantalla principal.                                    | El Stack raíz (pestañas).                   | `<Stack.Protected guard={sesion}>` en `_layout.tsx`.       |
| `bibliotecaipf://reserva`                     | La pantalla de "Mis Reservas".                                              | El Stack raíz.                              | `<Redirect href="/reservas" />` en `reserva.tsx`.          |
| `bibliotecaipf://escanear` (cámara bloqueada) | La pantalla del escáner con el botón para abrir Ajustes.                    | El Stack raíz.                              | `usePermiso` en `escanear.tsx` y `permisos/[recurso].tsx`. |

**¿Por qué `/libro/123` llega a la pantalla de detalle aunque no exista?**
Porque Expo Router hace un _matching_ de la URL contra los archivos (por eso `[isbn]` atrapa cualquier string). La responsabilidad de responder bien es **del componente** (`DetalleLibroScreen`), que es donde yo verifico que tenga 13 dígitos y busco en el catálogo. Si no lo hace, la app explotaría; al hacerlo, le muestro un mensaje de error amigable.

### C4. Foco, montaje y primer plano

**a)**

- `useEffect` con `[]`: Detecta el **montaje** (cuando el componente aparece por primera vez).
- `useFocusEffect`: Detecta el **foco de navegación** (cada vez que la pantalla se vuelve visible para el usuario, ya sea porque cambió de pestaña o volvió atrás).
- `AppState`: Detecta el **primer plano** (cuando la app pasa de estar minimizada o en segundo plano a estar activa).

**b)** Si la persona sale a Ajustes, habilita las notificaciones y vuelve, se entera la API de **`AppState`**.
Si va a la pestaña Catálogo y vuelve a "Mis reservas", se entera **`useFocusEffect`**.

**c)** En mi app, para el estado de las notificaciones en la pantalla de Reservas usé `useEffect` inicial y consulto el permiso cuando se activa el Switch.
Si hubiera usado solo `useEffect` al montar, la pantalla mostraría un estado viejo en este caso: el usuario entra a "Mis reservas" (se monta y lee que no hay permiso), va a Ajustes, lo activa, vuelve a la app tocando el ícono. La pantalla de Reservas no se volvió a montar, por lo que el `useEffect` no se volvió a ejecutar y la app sigue creyendo que no hay permiso. Para solucionarlo, debería usar `AppState` o `useFocusEffect` para revalidar el permiso.

## Parte D · Permisos y Notificaciones

### D1. Recorrido completo de la cámara (Android 14)

| #   | Acción                               | Qué muestra tu app                                                              | status         | canAskAgain |
| :-- | :----------------------------------- | :------------------------------------------------------------------------------ | :------------- | :---------- |
| 1   | Toca "Escanear" por primera vez.     | Pantalla previa `/permisos/camara` con el beneficio. Botón "Continuar".         | `undetermined` | `true`      |
| 2   | "Continuar" → "No permitir".         | Vuelve a la pantalla de escanear. Si intenta de nuevo, ve el botón "Continuar". | `denied`       | `true`      |
| 3   | Toca "Escanear" otra vez.            | Pantalla previa `/permisos/camara` con el beneficio y "Continuar".              | `denied`       | `true`      |
| 4   | "Continuar" → "No permitir".         | Vuelve a escanear. Si entra de nuevo, la app le muestra "Abrir Ajustes".        | `denied`       | `false`     |
| 5   | Toca "Escanear" otra vez.            | Pantalla previa `/permisos/camara` pero con el botón "Abrir Ajustes".           | `denied`       | `false`     |
| 6   | "Abrir Ajustes" → habilita → vuelve. | El botón vuelve a decir "Continuar" (o directamente muestra la cámara).         | `granted`      | `true`      |

**a) Repetición en iOS:**
En iOS cambia drásticamente en el **paso 2**. El sistema operativo de Apple solo permite mostrar el diálogo nativo **una única vez**. Si el usuario toca "No permitir", `canAskAgain` pasa a ser `false` inmediatamente. Por lo tanto, en el paso 3, mi app mostraría directamente el botón "Abrir Ajustes" sin intentar pedir el permiso de nuevo.

**b) Línea que decide entre "Continuar" y "Abrir Ajustes":**
En `src/app/permisos/[recurso].tsx`:

```tsx
{
  estado === "bloqueado" ? (
    <Boton titulo="Abrir Ajustes" onPress={() => Linking.openSettings()} />
  ) : (
    <Boton titulo="Continuar" onPress={handleContinuar} />
  );
}
```

Se basa en el campo canAskAgain (mapeado al estado 'bloqueado' en el hook usePermiso). No alcanza con mirar status porque status === 'denied' puede significar dos cosas distintas: que el usuario dijo que no pero el sistema permite volver a preguntar, o que ya no se puede preguntar más (bloqueado).

c) Vuelta de Ajustes:
La parte que se entera es el hook useCameraPermissions (o useFocusEffect si se implementa). Cuando la app vuelve del segundo plano, el hook vuelve a consultar el estado del permiso. Si esa parte no existiera, la app seguiría mostrando "Abrir Ajustes" (el estado viejo) aunque el usuario ya haya habilitado el permiso, obligándolo a cerrar y abrir la app.

### D2. Notificaciones y consistencia

**a)** Si no cancelara la notificación, al tocar "Devolver" el libro, 15 segundos después al usuario le saltaría una notificación en el celular diciendo "No te olvides de devolver el libro", a pesar de que ya lo devolvió. Esto genera confusión y desconfianza.

**b)** El identificador se guarda en el estado Prestamo dentro del BibliotecaContext.
Si la app se cierra antes de los 15 segundos, el sistema operativo (el OS) programa la alarma y la notificación se dispara igual, pero el ID se pierde de la memoria de React. El problema es que al volver a abrir la app, si el usuario desactiva el switch o devuelve el libro, la app no tendrá el ID para cancelarla, por lo que la notificación fantasma llegará. Se resolvería usando @react-native-async-storage/async-storage para guardar los préstamos y sus IDs en el disco.

**c)** En Android 13 o superior, el sistema exige que el canal de notificaciones ("prestamos") exista antes de que el usuario otorgue el permiso, de lo contrario, la notificación puede no mostrarse o el sistema puede ignorar la petición. En un Android 12 (o menor), no existe el permiso de notificaciones como tal; el usuario simplemente bloquea o desbloquea el canal desde los ajustes del sistema.

**d)** Si el permiso está denegado y me entregan un libro desde el mostrador, el código consulta el estado del permiso en ese preciso momento (usando await Notifications.getPermissionsAsync()). Si no está concedido, el aviso queda dentro de la app. Importa que se consulte en el momento (y no que se use un valor guardado en el Context) porque el usuario pudo haber cambiado el permiso en los ajustes del teléfono mientras la app estaba abierta.

### D3. Lo que tu app pide y lo que no

| Plataforma | Permiso o clave declarada | Función de la app que lo justifica   | ¿Quién lo agrega?            |
| :--------- | :------------------------ | :----------------------------------- | :--------------------------- |
| Android    | CAMERA                    | Escanear el código de barras EAN-13. | expo-camera (plugin).        |
| Android    | POST_NOTIFICATIONS        | Enviar recordatorios de devolución.  | expo-notifications (plugin). |
| iOS        | NSCameraUsageDescription  | Escanear el código de barras.        | expo-camera (plugin).        |

a) Por qué no declara RECORD_AUDIO:
Porque aunque expo-camera por defecto incluye permisos de micrófono (para grabar video), nuestra app no graba audio. Para cumplir con el mínimo privilegio, en el app.json configuramos:

["expo-camera", {
"microphonePermission": false,
"recordAudioAndroid": false
}]

Y además bloqueamos el permiso directamente en Android usando "blockedPermissions": ["android.permission.RECORD_AUDIO"].

b) Agregar foto de portada desde la galería:
Usaría el paquete expo-image-picker. Necesitaría el permiso READ_MEDIA_IMAGES (Android 13+) y NSPhotoLibraryUsageDescription (iOS). No alcanza con una actualización OTA. Requiere obligatoriamente una build nueva (development build o producción) porque se está agregando un nuevo módulo nativo y modificando los archivos de configuración del sistema (AndroidManifest.xml e Info.plist).

c) Lo que no se pudo verificar en Expo Go:

El texto de propósito personalizado en el diálogo de cámara (Expo Go muestra sus propios textos genéricos, no los de mi app.json).

La creación del canal de notificaciones en Android (Expo Go maneja sus propios canales internos, por lo que mi canal "prestamos" puede no comportarse al 100% como en producción).
Se verificaría creando un Development Build (usando EAS Build o compilación local) y probando en un dispositivo físico.

## Parte E · Revisión de código

### E1. Revisión del Catálogo

**a) Ocho problemas encontrados en el código del compañero:**

1. **Línea 10 (`useState<any[]>`)**: Error de mala práctica y TypeScript. Usa `any` en lugar de tipar el arreglo como `Libro[]`.
2. **Líneas 13-16 (Pedir permisos al montar)**: Mala práctica de UX y posible rechazo en tiendas. Pide permisos de cámara y notificaciones automáticamente sin una acción explícita del usuario (el TP pide que se pida _solo_ al activar el interruptor o al tocar "Escanear").
3. **Líneas 18-20 (Falta de array de dependencias)**: Error de rendimiento (bucle infinito). Al no tener `[]`, el `useEffect` se ejecuta en cada render, y como el `setLibros` provoca un nuevo render, se vuelve a ejecutar.
4. **Líneas 18-20 (Falta de limpieza)**: Error de ejecución. Si el componente se desmonta antes de que lleguen los datos, el `setLibros` intentará actualizar un componente desmontado.
5. **Líneas 18-20 (Falta manejo de errores)**: Mala práctica. No tiene `.catch()`, por lo que si la API falla (como hace el 20% de las veces), la app se queda cargando para siempre.
6. **Línea 22 (`function Fila`)**: Error grave de rendimiento. El componente `Fila` está definido dentro de `Catalogo`. En cada render, React destruye y vuelve a crear la función, desmontando y remontando toda la lista.
7. **Línea 24 (Concatenación de rutas)**: Mala práctica. Usa `'/libro/' + libro.isbn` en lugar de las rutas tipadas (ej. `href={{ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } }}`).
8. **Línea 25 (Estilos en línea)**: Mala práctica. Usa `style={{...}}` directamente, violando la regla de usar `StyleSheet.create` y el archivo de tema.
9. **Línea 34 (`ScrollView` + `.map`)**: Error grave de rendimiento. Usa `ScrollView` para una lista larga, renderizando todos los elementos de golpe. Debería ser un `FlatList`.
10. **Línea 35 (`key={i}`)**: Mala práctica. Usa el índice como key en lugar del ISBN (`key={libro.isbn}`).

**b) El efecto de las líneas 18 a 20:**
Al no tener array de dependencias, el efecto se ejecuta al montar y **después de cada re-render**. La secuencia es: se ejecuta el efecto -> pide datos a la API -> llegan los datos -> `setLibros` actualiza el estado -> React re-renderiza la pantalla -> al ser un nuevo render, el efecto se vuelve a ejecutar -> pide datos otra vez... Esto genera un bucle infinito de peticiones de red (durante el primer minuto estaría pidiendo datos sin parar).
Si `obtenerLibros()` devolviera siempre el mismo array, el bucle se detendría porque React compara la referencia (`Object.is`) y al ver que el estado es el mismo, cancela el re-render. Sin embargo, la lista no se actualizaría si los datos cambian realmente, por lo que el error de fondo seguiría ahí.

**c) Reescritura usando buenas prácticas:**
_(Esta es la versión que implementamos en nuestro `src/app/(tabs)/index.tsx` usando `FlatList`, `useLibros`, `TarjetaLibro` y las constantes del tema)._

**d) Rechazo vs Desinstalación:**

- **Rechazo de la tienda:** El problema de las líneas 13-16 (pedir permisos sensibles como notificaciones automáticamente al abrir la app sin interacción del usuario). Apple y Google rechazan esto en sus políticas de revisión.
- **Desinstalación:** El problema de las líneas 18-20 (bucle infinito de peticiones). Esto calienta el teléfono, consume batería y datos móviles. Un usuario desinstala una app de inmediato si le pasa esto.

**c) Reescritura del componente:**

```tsx
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useLibros } from "../../hooks/useLibros";
import { TEMA } from "../../constants/tema";
import { Boton } from "../../components/Boton";
import { TarjetaLibro } from "../../components/TarjetaLibro";
import { Ionicons } from "@expo/vector-icons";

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const router = useRouter();

  if (cargando)
    return <ActivityIndicator size="large" color={TEMA.colores.primario} />;
  if (error)
    return (
      <View>
        <Text>{error}</Text>
        <Boton titulo="Reintentar" onPress={reintentar} />
      </View>
    );

  return (
    <FlatList
      data={libros}
      keyExtractor={(item) => item.isbn}
      renderItem={({ item }) => <TarjetaLibro libro={item} />}
      ListHeaderComponent={
        <Boton titulo="Escanear" onPress={() => router.push("/escanear")} />
      }
      ListEmptyComponent={<Text>No hay libros.</Text>}
    />
  );
}
```
