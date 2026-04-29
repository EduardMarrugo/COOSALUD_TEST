# Developer Guide - Next.js Frontend

Esta guía proporciona instrucciones paso a paso para desarrolladores que trabajan en este proyecto de prototipos.

## Tabla de Contenidos

1. [Crear un Nuevo Prototipo (Vista)](#crear-un-nuevo-prototipo)
2. [Uso de Clases CSS Globales](#uso-de-clases-css-globales)
3. [Navegación y Dashboard](#navegación-y-dashboard)
4. [Estructura de Layout](#estructura-de-layout)

---

## Crear un Nuevo Prototipo

### Paso 1: Crear la Estructura de Rutas

Para agregar una nueva vista o prototipo, utiliza el App Router de Next.js:

```bash
mkdir -p app/mi-nuevo-prototipo
touch app/mi-nuevo-prototipo/page.tsx
```

### Paso 2: Implementar la Vista

Utiliza las clases `.ui-*` para estructurar la vista rápidamente:

```tsx
export default function MiPrototipo() {
  return (
    <div className="p-6">
      <div className="ui-panel">
        <div className="ui-panel__header">Título del Prototipo</div>
        <div className="ui-panel__body">
          Contenido aquí...
        </div>
      </div>
    </div>
  );
}
```

### Paso 3: Agregar al Sidebar y Dashboard

1. Abre `components/layout/Sidebar.tsx` y agrega un nuevo enlace apuntando a `/mi-nuevo-prototipo`.
2. Abre `app/page.tsx` (Dashboard) y agrega una tarjeta que enlace a tu nuevo prototipo.

---

## Uso de Clases CSS Globales

El proyecto utiliza un sistema de diseño definido en `app/globals.css`. Es importante priorizar estas clases en la construcción de interfaces principales.

### Botones
```tsx
<button className="ui-btn ui-btn--primary">Aceptar</button>
<button className="ui-btn ui-btn--outline">Cancelar</button>
```

### Formularios
```tsx
<div className="ui-form-grid ui-form-grid--cols-2">
  <div className="ui-field">
    <label className="ui-field__label">Nombre</label>
    <div className="ui-field__value">Juan Perez</div>
  </div>
</div>
```

### Estados Vacíos
```tsx
<div className="ui-empty-state">
  <SearchIcon />
  <p>No se encontraron resultados</p>
</div>
```

---

## Navegación y Dashboard

El proyecto tiene un **Sidebar** persistente. Si estás en vista móvil, el Sidebar se oculta automáticamente y se accede mediante un botón tipo hamburguesa en la barra superior.
El Dashboard principal (`app/page.tsx`) sirve como índice visual de todos los prototipos construidos.
