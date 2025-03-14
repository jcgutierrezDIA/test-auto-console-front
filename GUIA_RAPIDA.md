# Guía Rápida para Tests con Playwright

## Comandos Básicos

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar solo los tests de login
npm run test:login

# Ejecutar solo los tests del menú
npm run test:menu
```

### Ver Tests en la Interfaz Visual

```bash
# Ver todos los tests
npm run ui:all

# Ver solo los tests de login
npm run ui:login

# Ver solo los tests del menú
npm run ui:menu
```

## Flujo Principal de Prueba

El flujo principal que estamos probando es:

```typescript
// Hacer clic en el botón del menú
await page.getByRole('button').filter({ hasText: /^$/ }).click();

// Seleccionar la opción "Panel de Transporte"
await page.locator('[data-test-id="Panel de Transporte"]').click();

// Hacer clic en "Gestión de Coordinadores"
await page.locator('[data-test-id="Gestión de Coordinadores"]').click();

// Hacer clic en "Alta"
await page.locator('[data-test-id="Alta"]').getByText('Alta').click();

// Verificar que estamos en la página de Alta
await expect(page.getByRole('heading', { name: 'ALTA' })).toBeVisible();
```

## Cómo Crear Nuevos Tests (Paso a Paso)

### 1. Usar el generador automático

```bash
npm run create
```

Este comando te guiará para crear un nuevo test:
- Te pedirá el nombre del archivo (ej: usuarios)
- Te pedirá una etiqueta para el test (ej: users)
- Te pedirá una descripción de la funcionalidad

### 2. Editar el archivo .feature generado

Añade los pasos específicos que necesitas para tu test.

### 3. Ejecutar tu test

```bash
npm run test:mitag  # Donde "mitag" es la etiqueta que elegiste
```

## Consejos Prácticos

1. **Usa etiquetas (@login, @menu)** para organizar tus tests
2. **Reutiliza el paso "Estoy autenticado en la Consola"** para no tener que hacer login en cada test
3. **Usa selectores robustos** como `[data-test-id="nombreId"]` para identificar elementos

## Solución de Problemas Comunes

- **Si los tests fallan por problemas de autenticación**: Ejecuta `npm run auth`
- **Si no encuentras los tests en la UI**: Usa los comandos `npm run ui:login`, `npm run ui:menu`, etc.
- **Si los selectores no funcionan**: Revisa las capturas de pantalla generadas en la carpeta `screenshots`

## Estructura del Proyecto

```
test-auto/
├── features/             # Archivos .feature con escenarios BDD
│   ├── homepage.feature  # Escenarios para la página principal
│   └── steps/            # Implementación de los pasos
│       ├── fixtures.ts   # Configuración de BDD
│       └── index.ts      # Implementación de los pasos
├── playwright/           # Configuración de Playwright
│   └── .auth/            # Estado de autenticación
├── tests/                # Configuración de tests
│   ├── auth.setup.ts     # Configuración de autenticación
│   ├── check-auth.ts     # Script para verificar autenticación
│   └── fixtures.ts       # Configuración de BDD
├── create-test.js        # Script para crear nuevos tests
├── playwright.config.ts  # Configuración de Playwright
└── package.json          # Dependencias y scripts
``` 