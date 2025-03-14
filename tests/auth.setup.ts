import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Ruta al archivo de estado de autenticación
const authFile = path.join(process.cwd(), 'playwright/.auth/user.json');

// Función de configuración global
async function globalSetup() {
  console.log('Iniciando proceso de autenticación global...');
  
  // Verificar si ya existe un archivo de autenticación válido
  if (fs.existsSync(authFile)) {
    try {
      const fileContent = fs.readFileSync(authFile, 'utf-8');
      const authData = JSON.parse(fileContent);
      
      // Verificar si hay cookies guardadas
      const hasCookies = authData.cookies && authData.cookies.length > 0;
      
      if (hasCookies) {
        const fileStats = fs.statSync(authFile);
        const fileAgeHours = (Date.now() - fileStats.mtimeMs) / (1000 * 60 * 60);
        
        console.log(`Estado de autenticación existente encontrado (${fileAgeHours.toFixed(2)} horas de antigüedad).`);
        console.log(`Cookies guardadas: ${authData.cookies ? authData.cookies.length : 0}`);
        console.log(`Origins guardados: ${authData.origins ? authData.origins.length : 0}`);
        
        // Si el archivo tiene menos de 12 horas, usarlo
        if (fileAgeHours < 12) {
          console.log('Usando estado de autenticación existente.');
          return;
        } else {
          console.log('Estado de autenticación existente pero demasiado antiguo. Regenerando...');
        }
      } else {
        console.log('Estado de autenticación existente pero sin cookies. Regenerando...');
      }
    } catch (error) {
      console.log('Error al leer el archivo de autenticación existente. Regenerando...');
    }
  } else {
    console.log('No se encontró un archivo de autenticación existente. Creando uno nuevo...');
  }
  
  // Iniciar el navegador
  console.log('Navegador iniciado, comenzando proceso de login...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navegar a la página de inicio de sesión
    console.log('Intentando navegar a la página de login...');
    await page.goto('https://internal.dev.es.ecom.dgrp.io/console-front/index.html', { timeout: 60000 });
    console.log('Navegación a la página de login completada.');
    
    // Esperar a que la página de login esté completamente cargada
    await page.waitForLoadState('networkidle');
    console.log('Página de login cargada, ingresando credenciales...');
    
    // Hacer clic en el enlace de USUARIOS EXTERNOS
    await page.getByRole('link', { name: ' USUARIOS EXTERNOS' }).click();
    
    // Ingresar credenciales
    await page.getByRole('textbox', { name: 'Usuario' }).fill('QAtildes');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('tildes');
    
    // Hacer clic en el botón de LOGIN
    await page.getByRole('button', { name: 'LOGIN' }).click();
    
    // Esperar a que se complete la navegación después del inicio de sesión
    await page.waitForSelector('[data-test-id="userName"]', { timeout: 30000 });
    
    console.log(`URL después de la autenticación: ${page.url()}`);
    
    // Guardar el estado de autenticación
    console.log(`Guardando estado de autenticación en: ${authFile}`);
    
    // Asegurarse de que el directorio existe
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Guardar el estado
    await context.storageState({ path: authFile });
    
    // Verificar que el archivo se creó correctamente
    if (fs.existsSync(authFile)) {
      const stats = fs.statSync(authFile);
      console.log(`Archivo de estado creado correctamente. Tamaño: ${stats.size} bytes`);
      
      // Leer el archivo para verificar su contenido
      const fileContent = fs.readFileSync(authFile, 'utf-8');
      const authData = JSON.parse(fileContent);
      console.log(`Cookies guardadas: ${authData.cookies ? authData.cookies.length : 0}`);
      console.log(`Origins guardados: ${authData.origins ? authData.origins.length : 0}`);
    } else {
      console.error('Error: No se pudo crear el archivo de estado de autenticación.');
    }
    
    console.log('Proceso de autenticación completado con éxito.');
  } catch (error) {
    console.error('Error durante el proceso de autenticación:', error);
    
    // Crear un estado de autenticación mínimo para que las pruebas puedan ejecutarse
    console.log('Creando estado de autenticación mínimo debido a problemas de conectividad...');
    
    const minimalState = {
      cookies: [],
      origins: [
        {
          origin: 'https://internal.dev.es.ecom.dgrp.io',
          localStorage: [
            {
              name: 'auth_fallback',
              value: 'true'
            }
          ]
        }
      ]
    };
    
    // Asegurarse de que el directorio existe
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Guardar el estado mínimo
    fs.writeFileSync(authFile, JSON.stringify(minimalState, null, 2));
    
    console.log('Estado de autenticación mínimo creado. Las pruebas podrán ejecutarse, pero fallarán si requieren autenticación real.');
  } finally {
    // Cerrar el navegador
    await browser.close();
  }
}

export default globalSetup; 