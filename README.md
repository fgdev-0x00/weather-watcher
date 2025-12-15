# Weather-watcher

Aplicación web para revisar el estado del clima en destintos populares.

## Stack

- **Backend:** NodeJs + Express
- **Frontend:** React + Tailwind

## Ejecucion

El proyecto lo creé dockerizado para poderlo ejecutar en otros ambientes sin problemas de versiones, por lo que si se prueba con Docker, solo hay que hacer un build y después levantar los servicios:

```bash
# Build
docker compose build

# levantar servicios
docker compose up -d
```

Con esto, los servicios deben ejecutarse frontend en puerto `5173` y backend en el puerto `3000`.

Para ingresar a la app desde el navegador, se debe ir a la URL `127.0.0.1:5173`, esto debe mostrar la pantalla de login.

<img width="919" height="774" alt="Captura de pantalla 2025-12-15 150738" src="https://github.com/user-attachments/assets/5473ddc9-b057-4f17-a808-dc09d2540977" />

**No hay usuarios previamente creados**, pero en el login principal hay un botón para ir al registro y crear la cuenta; esta solo requiere:

- Username
- Password (mínimo 8 caracteres)

Si la longitud de la password no se cumple, se le muestra un mensaje al usuario, además de que se deshabilita el botón.

Al ser un proyecto de prueba, **los usuarios solo se mantienen mientras el servidor de Node esté en ejecución**; si se apaga o reinicia, se borran los usuarios.

Después del login, si no existen datos de ciudades cargados en caché, se manda la petición a Open Weather. **Este caché sí tiene persistencia**, aunque el servidor se detenga o reinicie, mientras no se venza el tiempo de vida del caché.

## Desarrollo

El primer paso fue revisar el **documento con los requerimientos** del challenge para planear el flujo que se requería, revisando las APIs externas necesarias y componentes del cliente que se debían crear y los endpoints en el backend.

**Requerimientos:**
- Entrada con usuario y contraseña
- Lista de Ciudades Populares
- Detalles del Clima por Ciudad

Con el flujo decidido, elegí el stack mencionado arriba, dado que ya lo había usado en proyectos pasados y permite hacer el proyecto bastante modular, dejándolo listo para escalarlo en el futuro.

### AI Assisted

#### Estructura y diseño

Para el desarrollo del proyecto, me apoyé en **Gemini**, inicialmente para generar el diseño de la interfaz con el modo canvas del modelo, dándole los requerimientos y el flujo planeado, junto a la descripción visual que quería en la UI:

- Diseño basado en UX intuitiva y minimalista.
- Tema claro

Además de mencionar que usaría React para hacer el diseño más compatible con el stack y que lo haría dockerizado.

Con el diseño generado, lo descargué como HTML para usarlo como **mockup**, el mismo que fue utilizado para crear los componentes y estructura básica de React con Tailwind, generando también los estilos globales y paleta de colores del proyecto basado en el mockup generado.

<img width="1218" height="847" alt="Captura de pantalla 2025-12-14 013902" src="https://github.com/user-attachments/assets/2f53582c-c339-4862-8bcf-bb8f34336533" />

--

Otro uso del modelo fue generar la estructura de Docker para usarlo con Docker Compose; aquí generó los dos servicios (frontend y backend), así como los respectivos Dockerfiles.

---

Este modelo también lo usé para ahorrar tiempo en el backend y poder enfocarme en tareas como la implementación de las API externas; principalmente lo usé para generar la estructura básica del proyecto, dando indicaciones en el prompt sobre la arquitectura que quería:

- Estructura modular de **Node con Express**
- Elementos siguiendo principios como **single response**.

Rutas encargadas de:

- validar la autenticación del usuario mediante middlewares, cuando se requiere
- dirigir al controlador correcto,

Los controladores encargados de:

- recibir, validar, parsear datos
- enviar respuestas al cliente.

Servicios para las tareas específicas de la lógica:

- reciben los datos en el formato que se requiere, parseados en el controlador
- usando helpers para poder reutilizar lógica en distintas partes del código

Otra tarea importante en la que implementé a Gemini fue **solicitando la implementación de un caché local** basado en Redis, pero sin tener que usar Redis, dado que esto es un proyecto de prueba.

#### Model Tunning

Con los componentes y estructura tanto de frontend como de backend, después de hacer pruebas iniciales, pedí ajustes, pasando al prompt:

- estado actual del código
- problema observado
- cambios sugeridos

Con esto el modelo no pierde el contexto, además de **versionar con Git** para evitar romper el código, por ejempl oen estos dos ejemplos en concreto:

**Optimizacion de peticiones en el frontend:**

En el frontend se duplicaban peticiones al backend, esto observado en la consola de network. Describí el comportamiento al modelo, además de pasarle el estado actual de los componentes donde se generaban las peticiones; con esto generó una solución, la cual volví a probar revisando el nuevo comportamiento, asegurando que funcionara todo bien.

**Parser basado en analizis de JSON:**

En el backend, un uso puntual fue generar un parser para los datos obtenidos de la API de OpenWeather. Le di de input al prompt el JSON de respuesta y los datos que requería, basado en los requerimientos, esto para aumentar el contexto del modelo, y así ahorrar tiempo, ya que el modelo pudo analizar mejor el JSON. En este pedido, ajuste en cuanto a las keys que dio el modelo al JSON parseado para que los cambiara, simplificándolos.

---
Finalmente, probé todo el flujo asegurando el funcionamiento completo de la aplicación. Esta parte fue importante, así no solo se copia lo que genera el modelo, sino que se revisa para asegurar que sea una implementación correcta. Esto me permitió centrarme en otras tareas más puntuales de la lógica requerida, dejando a **Gemini** tareas repetitivas o más tediosas, pero siempre revisando sus implementaciones.
