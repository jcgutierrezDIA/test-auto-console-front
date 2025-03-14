# Test Automation con Playwright y BDD

Este proyecto implementa pruebas automatizadas para la Consola utilizando Playwright y el enfoque BDD (Behavior-Driven Development)

## Características

- ✅ **Autenticación global**: Login una sola vez para todas las pruebas
- ✅ **Enfoque BDD**: Tests escritos en lenguaje natural con Gherkin
- ✅ **Organización por etiquetas**: Ejecuta solo los tests que necesitas
- ✅ **Generador de tests**: Crea nuevos tests fácilmente
- ✅ **Capturas de pantalla**: Diagnóstico visual de fallos
- ✅ **Interfaz visual**: Depura tus tests con la UI de Playwright

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Instalar dependencias
cd test-auto
npm install

# Instalar navegadores de Playwright
npx playwright install
```

## Uso

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

### Crear Nuevos Tests

```bash
# Usar el generador interactivo
npm run create
```

### Gestionar Autenticación

```bash
# Regenerar el estado de autenticación
npm run auth

# Verificar el estado de autenticación
npm run check:auth
```

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

## Guía Rápida

Para una guía rápida de uso, consulta el archivo [GUIA_RAPIDA.md](./GUIA_RAPIDA.md). 