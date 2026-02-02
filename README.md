# WebCitas — Agenda semanal (demo)

Aplicación web simple para gestionar citas semanales en slots de 30 minutos (09:00–23:00).

Características:
- Dos tipos de usuario: `Usuario` y `Administrador`.
- Usuario: puede ver la semana y crear citas en huecos libres; solo puede editar/eliminar sus propias citas.
- Administrador: puede crear, editar y eliminar cualquier cita; puede marcar huecos no disponibles.
- Persistencia local mediante localStorage (sin backend).

Uso:
1. Abrir `index.html` en el navegador.
2. Introduce un nombre y selecciona rol (Usuario/Admin).
3. Haz click en cualquier hueco para crear o ver/editar una cita.

Notas:
- Esta es una versión demo sin autenticación segura. Para producción se necesita backend, autenticación y control de concurrencia.

