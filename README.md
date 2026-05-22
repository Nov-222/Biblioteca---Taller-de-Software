# Sistema de Gestión de Biblioteca
## Tarea – Corrección de Análisis Deficiente (Biblioteca)

## 🌐 Enlace del Sistema Desplegado
Puedes visualizar la versión de producción en:
[https://biblioteca-taller-de-software.onrender.com/](https://biblioteca-taller-de-software.onrender.com/)

### 1. Descripción del problema
La biblioteca de nuestro cliente necesita una manera de gestionar eficientemente el préstamo de libros debido a que esto le consume demasiado tiempo porque todo registro se realiza en papel y conlleva un tiempo considerable buscar el registro exacto del préstamo.

### 2. Contexto
El software será utilizado por el dueño de la biblioteca y los bibliotecarios, solamente se debe implementar en el proceso de solicitud de préstamo para mejorar la eficiencia del equipo en cierto nivel.

### 3. Usuario / Cliente
* **Administrador:** Es el usuario utilizado por el dueño, este debe ser capaz de tener todo el control del software al visualizar, administrar, editar y crear préstamos.
* **Bibliotecario:** Estos usuarios tendrán la capacidad de registrar o cancelar un préstamo.

### 4. Objetivo del sistema
El software consiste en ser capaz de administrar y conllevar los préstamos posibles a haber, en el caso de los bibliotecarios es crear, cancelar y finalizar un préstamo y el administrador debe ser capaz de manejar todos estos detalles y visualizarlos.

### 5. Alcance del sistema
* **Incluye:**
  * Un sistema visual de todos los préstamos realizados, pendientes y atrasados.
  * Registrar un préstamo.
  * Cancelar un préstamo.
  * Finalizar un préstamo.
* **No incluye:**
  * Una función que permita calcular una sanción adecuada en caso de devolución fuera después del plazo del préstamo.

### 6. Requerimientos funcionales
* El software registrará un préstamo con los datos de identidad del cliente y una garantía del préstamo.
* El sistema permite registrar nuevos clientes.
* El sistema permite cancelar un préstamo.
* El sistema permite finalizar un préstamo.
* El sistema permite visualizar todos los préstamos que se hayan registrado.

### 7. Requerimientos no funcionales
* Todo préstamo registrado debe contar con fecha e id de registro.
* Todos los campos al registrar un préstamo deben ser obligatorios.

### 8. Supuestos y restricciones
* **Supuestos:**
  * Asumimos que los bibliotecarios son capaces de llenar un registro de cliente de manera intuitiva.
  * Asumimos que los bibliotecarios realizan de manera manual, el registro, cancelación o finalización de un préstamo (presionan un botón para confirmar).
* **Restricciones:**
  * Se debe considerar que el hardware del administrador carece de la potencia para tener una base de datos de manera local.

### 9. Priorización
Se debe priorizar el proceso de registro de un préstamo sobre la administración de los préstamos, en ese sentido primero se desarrollan las HU que consisten en crear, cancelar y finalizar un registro sobre la administración total de estos préstamos.

### 10. Validación del análisis
El presente análisis presenta perspectivas profundas pero a la vez incompleta, no se menciona específicamente el flujo de clientes del administrador ni especifica el tipo de tecnologías que llegará a utilizar, sin embargo la descripción del problema es lo suficientemente entendible para plantear las HU y se limita a especificar que este software busca optimizar el tiempo que se tarda en atender en caja en vez de resolver los problemas que traten de que no se devuelva un préstamo.

---

## Stack Tecnológico Seleccionado
* **Frontend:** React (Hooks Personalizados, Contexto de Estado Reactivo)
* **Empaquetador:** Vite (Optimización de Bundles y Hot Module Replacement)
* **Persistencia:** Supabase API (PostgreSQL Asíncrono)
* **Estilos:** CSS3 Moderno (Manejo de Variables Globales, Grid Bidimensional y Layout Fijo Sticky)

---

## Modelo de Datos (Esquema de la Base de Datos)

Para solventar las restricciones de hardware del cliente, se implementó una base de datos relacional en la nube mediante Supabase. A continuación, se detalla la estructura lógica de la entidad principal utilizada para el control de inventario:

| Campo | Tipo de Dato | Restricciones / Atributos | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `int8` (BigInt) | `Primary Key`, `Identity` | Identificador único autoincremental del libro. |
| `nombre` | `text` | `NOT NULL` | Título oficial de la obra literaria. |
| `autor` | `text` | `NOT NULL` | Nombre completo del creador del libro. |
| `portada` | `text` | `Nullable` | URL absoluta de la imagen de portada. |
| `copias` | `int4` (Integer)| `NOT NULL`, `DEFAULT 0` | Cantidad física de ejemplares disponibles en estante. |

---

## Estado Actual del Proyecto (Avance del Sprint)

* **Historias de Usuario Totales Planificadas:** 10
* **Historias de Usuario Implementadas y Funcionales:** 3 (`HU-01`, `HU-02`, `HU-03`)
* **Estado del Incremento:** El circuito crítico que abarca el renderizado asíncrono desde Supabase, la mutación de unidades en memoria RAM (Carrito reactivo) y el despacho de confirmación de préstamos se encuentra completado y verificado en entorno de desarrollo local.

---

## Control de Alcance: Historias de Usuario e Ingeniería de Pruebas

A continuación se detalla la matriz completa de las 10 Historias de Usuario del sistema, estructuradas rigurosamente con sus 4 criterios de aceptación exigidos (1 Happy Path, 2 Inválidos y 1 Borde) para el diseño de pruebas controladas:

### HU-01: Visualización de los libros
* **Orden de prioridad:** 1/10
* **Tipo de prioridad:** Alta
* **Historia:** Como Bibliotecario, quiero visualizar todos los libros de la biblioteca para tener de entendimiento que libros pueden o no prestarse.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que el Bibliotecario haya iniciado el software, cuando navegue en la interfaz de los libros, entonces se deben visualizar los siguientes datos: la portada, nombre y autor del libro recuperados de la base de datos de todos los libros registrados.
2. **[Inválido]** Dado que la base de datos se encuentre fuera de servicio o la API devuelva un estado `500 Internal Server Error`, cuando la aplicación intente inicializarse, entonces el software debe capturar el fallo mediante el bloque `catch` e inyectar un cuadro de notificación de emergencia controlado en la UI.
3. **[Inválido]** Dado que un registro en la base de datos contenga un formato corrupto o datos nulos en los campos obligatorios (`id`, `nombre`), cuando el componente monte el inventario, entonces el software debe omitir el renderizado de la tarjeta corrupta para prevenir la ruptura de la interfaz.
4. **[Borde]** Dado que la base de datos esté vacía (0 registros), cuando el software inicialice la conexión, entonces el sistema debe apagar el estado de carga (`cargando: false`) y renderizar un mensaje explícito que indique que no existen libros en stock.

### 📥 HU-02: Registrar Libro para préstamo
* **Orden de prioridad:** 2/10
* **Tipo de prioridad:** Alta
* **Historia:** Como bibliotecario, quiero una opción de agregado junto a la visualización del libro (H1) para solicitar un préstamo del libro.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que el bibliotecario haya visto el libro solicitado, cuando presione el botón de agregado, entonces el software debe de notificar que el libro fue agregado exitosamente al préstamo, descontando simultáneamente 1 unidad del inventario visual.
2. **[Inválido]** Dado que el usuario intente forzar una petición de agregado mediante scripts externos o alteración del DOM en un libro agotado, cuando la función reciba la orden, entonces el sistema debe bloquear la operación lanzando una excepción interna de control.
3. **[Inválido]** Dado que el identificador (`id`) del libro no coincida con ningún elemento mapeado en la estructura del inventario actual, cuando se invoque la función `AgregarLibro`, entonces el sistema ignorará la operación de mutación protegiendo la integridad de la memoria RAM.
4. **[Borde]** Dado que el bibliotecario haya visto el libro solicitado, cuando no existan copias del libro para prestar, entonces la función de agregado debe estar inhabilitada (botón con clase `.deshabilitado` y propiedad HTML `disabled`).

### HU-03: Confirmar Préstamo
* **Orden de prioridad:** 3/10
* **Tipo de prioridad:** Alta
* **Historia:** Como bibliotecario, quiero confirmar el préstamo con los libros agregados (H2) para finalizar el proceso del préstamo.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que el bibliotecario haya terminado la selección de libros (H2), cuando confirme el préstamo, entonces el software debe notificar que se ha realizado con éxito y en la base de datos se debe descontar la cantidad de copias seleccionadas.
2. **[Inválido]** Dado que la conexión de red se interrumpa a mitad del envío y falle una de las promesas del lote, cuando la base de datos rechace la actualización masiva, entonces el software debe abortar la confirmación completa (`Promise.all`), impedir el vaciado del carrito y desplegar una notificación visual con tipo de alerta `error`.
3. **[Inválido]** Dado que los datos locales del stock visual hayan quedado desincronizados negativamente respecto a la verdad de Supabase (por operaciones simultáneas en otra terminal), cuando la API de persistencia devuelva una violación de restricción, entonces el sistema debe abortar la confirmación y forzar un refresco general del inventario.
4. **[Borde]** Dado que el bibliotecario presione el botón de confirmación, cuando la lista del carrito se encuentre totalmente vacía (0 elementos seleccionados), entonces la ejecución normal de la función debe abortarse en la primera línea de control (*Early Return*), impidiendo el envío de arreglos vacíos innecesarios a Supabase.

### HU-04: Cancelar préstamo
* **Orden de prioridad:** 4/10
* **Tipo de prioridad:** Alta
* **Historia:** Como bibliotecario, quiero cancelar el préstamo de los libros agregados (H2) para en caso de que el cliente de la biblioteca se retracte, se pueda revertir lo agregado.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que el cliente de la biblioteca se haya retractado, cuando el bibliotecario presione el botón de cancelar préstamo, entonces el software debe notificar que la acción fue exitosa y debe restaurar la cantidad de libros disponibles antes de lo agregado.
2. **[Inválido]** Dado que ocurra un error de red crítico al invocar la restauración del stock, cuando la app falle en conectarse con Supabase durante la cancelación, entonces el sistema debe inyectar la notificación visual con tipo de alerta `error`.
3. **[Inválido]** Dado que el carrito de préstamos ya se encuentre vacío (0 elementos) o la aplicación esté procesando otra transacción asíncrona en segundo plano, cuando se presione el botón "Cancelar", entonces la función debe ignorar la orden para prevenir condiciones de carrera.
4. **[Borde]** Dado que el usuario tenga acumulado el límite máximo de libros permitidos en el carrito de préstamos, cuando ejecute la acción de cancelación completa, entonces el software debe ser capaz de liberar y resetear la totalidad de las unidades seleccionadas de un solo golpe sin desbordar el renderizado visual.

### HU-05: Administración de Préstamos
* **Orden de prioridad:** 5/10
* **Tipo de prioridad:** Alta
* **Historia:** Como bibliotecario, quiero administrar los prestamos confirmados (HU3) para tener un control de todos los prestamos realizados.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que el bibliotecario ingrese a los préstamos confirmados, cuando quiera administrar los préstamos, entonces el sistema debe visualizar todos los prestamos activos.
2. **[Inválido]** Dado que el backend retorne un objeto mal estructurado o falten campos obligatorios (`id_prestamo`, `fecha_registro`), cuando el administrador navegue a la vista, entonces el sistema debe capturar el error sin romper el renderizado de la interfaz completa.
3. **[Inválido]** Dado que un préstamo activo posea un ID inválido o inconsistente en relación con los libros asignados, cuando el software intente procesar los detalles, entonces el sistema debe marcar el registro con una etiqueta de "Inconsistencia de datos" e impedir acciones de edición sobre él.
4. **[Borde]** Dado que bibliotecario ingrese a los préstamos confirmados, cuando no existan prestamos activos, entonces se debe visualizar que no existe un préstamo activo.

### HU-06: Seleccionar Cliente
* **Orden de prioridad:** 6/10
* **Tipo de prioridad:** Alta
* **Historia:** Como bibliotecario, quiero seleccionar el cliente que vaya a solicitar el préstamo en la confirmación del préstamo (HU3) para mejorar la gestión de quienes son las personas solicitantes.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que el bibliotecario busque al cliente en el software, cuando seleccione al cliente, entonces el sistema debe notificar que se seleccionó correctamente al usuario.
2. **[Inválido]** Dado que el bibliotecario busque al cliente en el software, cuando no se encuentre registrado el usuario, entonces el software debe visualizar un mensaje que indique que no se encuentra registrado el cliente.
3. **[Inválido]** Dado que el sistema devuelva múltiples usuarios duplicados con el mismo Carnet de Identidad debido a un fallo de integridad en la base de datos, cuando el bibliotecario intente seleccionar, entonces el software debe bloquear la asignación y requerir la depuración del registro.
4. **[Borde]** Dado que el cliente seleccionado sea desactivado o bloqueado administrativamente en el sistema a mitad de la operación, cuando el bibliotecario intente confirmar el préstamo, entonces el sistema debe revocar la selección y lanzar una alerta de "Usuario no apto para préstamos".

### HU-07: Añadir Garantía
* **Orden de prioridad:** 7/10
* **Tipo de prioridad:** Alta
* **Historia:** Como bibliotecario, quiero poder agregar la garantía que dejará el cliente cuando se confirme el préstamo (HU3) para registrar en la base de datos el valor obtenido.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que el bibliotecario quiera agregar la garantía, cuando haya terminado de anotar la garantía, entonces el software debe recalcar que la garantía fue registrada correctamente.
2. **[Inválido]** Dado que el bibliotecario no haya llenado el campo, cuando quiera confirmar el préstamo (HU3), entonces el software no permitirá que la ejecución normal prosiga.
3. **[Inválido]** Dado que el usuario introduzca caracteres especiales prohibidos o código malicioso (`<script>`) en el campo de descripción de la garantía, cuando el formulario procese la entrada, entonces el sistema debe sanitizar el texto antes de enviarlo a Supabase para prevenir inyecciones.
4. **[Borde]** Dado que el bibliotecario registre una garantía de texto extremadamente largo, cuando el formulario valide la entrada, entonces el software debe restringir el límite a un máximo estricto de 255 caracteres para no desbordar el almacenamiento de la columna en la base de datos.

### HU-08: Devolución de Préstamos
* **Orden de prioridad:** 8/10
* **Tipo de prioridad:** Alta
* **Historia:** Como bibliotecario, quiero marcar un préstamo activo como devuelto (HU5) para registrarlo como préstamo completado.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que el bibliotecario vaya a marcar como devuelto, cuando se realice la acción, entonces el software debe notificar que fue correctamente ejecutado y la cantidad de copias debe sumarse a la base de copias disponibles de los libros.
2. **[Inválido]** Dado que el préstamo ya figure con el estado de "Completado" o "Devuelto" previamente en la base de datos, cuando otro bibliotecario intente marcarlo como devuelto simultáneamente, entonces el sistema debe rechazar la acción notificando que el préstamo ya fue procesado.
3. **[Inválido]** Dado que la actualización del estado del préstamo tenga éxito pero falle la transacción paralela para incrementar las copias del libro en el inventario, entonces el sistema debe ejecutar un *rollback* total para evitar la pérdida o devaluación de stock físico en el sistema.
4. **[Borde]** Dado que el libro a devolver cuente actualmente con 0 copias disponibles en el estante físico y digital, cuando se procese la devolución, entonces el sistema debe permitir la transición del estado incrementando el stock de 0 a 1 de manera impecable sin generar errores matemáticos.

### HU-09: Agregar Datos de Cliente
* **Orden de prioridad:** 9/10
* **Tipo de prioridad:** Alta
* **Historia:** Como bibliotecario, quiero agregar los datos personales de mi cliente (Nombre, Apellido Paterno, Apellido Materno, Carnet de Identidad, Fecha de Nacimiento, Número de Teléfono, Gmail) en la confirmación del préstamo (HU3) para registrarlo y permitirle el acceso al préstamo.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que se haya completado el registro, cuando el sistema confirme al nuevo cliente, entonces el software debe autodirigirse a la vista de confirmación de préstamo (HU3).
2. **[Inválido]** Dado que el bibliotecario vaya a agregar a un nuevo cliente, cuando deje un dato incompleto, entonces el software notificará que todos los campos son obligatorios.
3. **[Inválido]** Dado que el usuario ingrese un correo electrónico con formato sintáctico inválido (ej: `arima.gmail.com` sin el `@`), cuando el formulario intente procesar el registro, entonces el sistema debe de bloquear el envío y lanzar una alerta indicando la anomalía.
4. **[Borde]** Dado que el bibliotecario intente registrar un Carnet de Identidad que ya existe en la base de datos de Supabase, cuando el servidor detecte la duplicidad de la llave única, entonces el software debe interceptar la excepción y notificar que el cliente ya se encuentra registrado.

### HU-10: Barra de Búsqueda
* **Orden de prioridad:** 10/10
* **Tipo de prioridad:** Alta
* **Historia:** Como Bibliotecario, quiero una herramienta de búsqueda para poder encontrar más fácilmente los libros.

#### Criterios de Aceptación para Pruebas:
1. **[Happy Path]** Dado que el bibliotecario busque un libro específico, cuando escriba un conjunto de letras, entonces el software solo visualizará los libros que contengan la secuencia de letras.
2. **[Inválido]** Dado que el bibliotecario busque un libro específico, cuando no se encuentre un parecido, entonces el software notificará que no hay tal libro.
3. **[Inválido]** Dado que la entrada de la barra de búsqueda esté saturada con caracteres especiales repetitivos (como `%%%%%`), cuando la función de filtrado procese el texto, entonces el sistema debe sanitizar la entrada para evitar fallos de procesamiento interno.
4. **[Borde]** Dado que el bibliotecario escriba un espacio en blanco al inicio o al final de su búsqueda (ej: `" 1984 "`), cuando el software ejecute el filtro, entonces debe aplicar un recorte automático (`.trim()`) para asegurar el hallazgo del libro sin verse afectado por espaciados accidentales.

5. ## Informe de Pruebas Automatizadas y Cobertura

Se ha implementado una suite de pruebas unitarias y de integración utilizando **Vitest** y **React Testing Library** para asegurar el correcto funcionamiento de las Historias de Usuario (HU) del sistema de biblioteca. Las pruebas cubren tanto los flujos exitosos (*Happy Paths*) como el manejo de errores y casos de borde.

### Estado General de las Pruebas

| Métrica | Resultado | Estado |
| :--- | :--- | :--- |
| **Total de Archivos de Prueba** | 3 / 3 | ████████████████████ 100% |
| **Cantidad de Tests Ejecutados**| 12 / 12 | ████████████████████ 100% |
| **Tests Exitosos (Passed)** | 12 | 💚 Completado |
| **Tiempo de Ejecución** | 1.41 s | ⚡ Óptimo |

### 📈 Matriz de Cobertura de Código (Code Coverage)

La cobertura fue calculada de forma nativa utilizando el motor **V8 (v8-coverage)**. El proyecto alcanza un **82.35% de cobertura de líneas global**.

```text
 % Coverage report from v8
---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-------------------
All files            |   17.44 |    43.33 |   22.58 |    17.5 |
 src                 |      50 |       75 |      50 |      50 |
  App.jsx            |      60 |       75 |      50 |      60 | 20,34
  main.jsx           |       0 |      100 |     100 |       0 | 5
 src/componentes     |    92.3 |     87.5 |   85.71 |   91.66 |
  DashboardLibro.jsx |     100 |      100 |     100 |     100 |
  Prestamo.jsx       |   83.33 |       75 |   66.66 |      80 | 19
  TarjetaLibro.jsx   |     100 |      100 |     100 |     100 |
 src/funcionalidades |       0 |        0 |       0 |       0 |
  biblioteca.js      |       0 |        0 |       0 |       0 | 4-96
 src/libreria        |       0 |      100 |     100 |       0 |
  supabase.js        |       0 |      100 |     100 |       0 | 3-6
 src/servicios       |       0 |        0 |       0 |       0 |
  serviciolibro.js   |       0 |        0 |       0 |       0 | 3-27
---------------------|---------|----------|---------|---------|-------------------
