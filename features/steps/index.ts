import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import { Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Ruta al archivo de estado de autenticación
const authFile = path.join(process.cwd(), 'playwright/.auth/user.json');

// ===== FUNCIONES AUXILIARES =====

// Función para tomar capturas de pantalla
async function takeScreenshot(page: Page, name: string) {
  try {
    const screenshotPath = `screenshots/${name}-${Date.now()}.png`;
    
    // Asegurarse de que el directorio existe
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Captura guardada: ${screenshotPath}`);
  } catch (error: any) {
    console.error(`❌ Error al tomar captura: ${error.message}`);
  }
}

// Función para hacer clic en un elemento con múltiples estrategias
async function clickElement(page: Page, texto: string, timeout = 10000) {
  console.log(`🖱️ Intentando hacer clic en "${texto}"`);
  console.log(`🌐 URL actual: ${page.url()}`);
  
  // Lista de estrategias a intentar
  const strategies = [
    // Estrategia 1: Por rol y nombre exacto
    async () => {
      console.log('Estrategia 1: Por rol y nombre exacto');
      await page.getByRole('link', { name: texto }).click({ timeout });
      return true;
    },
    // Estrategia 2: Por rol de botón y nombre exacto
    async () => {
      console.log('Estrategia 2: Por rol de botón y nombre exacto');
      await page.getByRole('button', { name: texto }).click({ timeout });
      return true;
    },
    // Estrategia 3: Por texto exacto
    async () => {
      console.log('Estrategia 3: Por texto exacto');
      await page.getByText(texto, { exact: true }).click({ timeout });
      return true;
    },
    // Estrategia 4: Por texto parcial
    async () => {
      console.log('Estrategia 4: Por texto parcial');
      await page.getByText(texto).click({ timeout });
      return true;
    },
    // Estrategia 5: Por selector CSS para enlaces
    async () => {
      console.log('Estrategia 5: Por selector CSS para enlaces');
      await page.locator(`a:has-text("${texto}")`).click({ timeout });
      return true;
    },
    // Estrategia 6: Por selector CSS para botones
    async () => {
      console.log('Estrategia 6: Por selector CSS para botones');
      await page.locator(`button:has-text("${texto}")`).click({ timeout });
      return true;
    }
  ];
  
  // Intentar cada estrategia
  for (let i = 0; i < strategies.length; i++) {
    try {
      await strategies[i]();
      console.log(`✅ Éxito con estrategia ${i + 1}`);
      return;
    } catch (error: any) {
      console.log(`❌ Estrategia ${i + 1} falló: ${error.message}`);
    }
  }
  
  // Si llegamos aquí, todas las estrategias fallaron
  console.error(`❌ No se pudo hacer clic en "${texto}" con ninguna estrategia`);
  
  // Tomar captura de pantalla
  await takeScreenshot(page, `error-click-${texto}`);
  
  // Mostrar elementos en la página para depuración
  await logPageElements(page);
  
  throw new Error(`No se pudo hacer clic en "${texto}"`);
}

// Función para verificar que un texto es visible con múltiples estrategias
async function checkTextVisible(page: Page, texto: string, timeout = 10000) {
  console.log(`🔍 Verificando que "${texto}" sea visible`);
  
  // Lista de estrategias a intentar
  const strategies = [
    // Estrategia 1: Por texto exacto
    async () => {
      console.log('Estrategia 1: Por texto exacto');
      await expect(page.getByText(texto, { exact: true })).toBeVisible({ timeout });
      return true;
    },
    // Estrategia 2: Por texto parcial
    async () => {
      console.log('Estrategia 2: Por texto parcial');
      await expect(page.getByText(texto)).toBeVisible({ timeout });
      return true;
    },
    // Estrategia 3: Por encabezado
    async () => {
      console.log('Estrategia 3: Por encabezado');
      await expect(page.getByRole('heading', { name: texto })).toBeVisible({ timeout });
      return true;
    },
    // Estrategia 4: Por selector CSS
    async () => {
      console.log('Estrategia 4: Por selector CSS');
      await expect(page.locator(`text="${texto}"`)).toBeVisible({ timeout });
      return true;
    }
  ];
  
  // Intentar cada estrategia
  for (let i = 0; i < strategies.length; i++) {
    try {
      await strategies[i]();
      console.log(`✅ Éxito con estrategia ${i + 1}`);
      return;
    } catch (error: any) {
      console.log(`❌ Estrategia ${i + 1} falló: ${error.message}`);
    }
  }
  
  // Si llegamos aquí, todas las estrategias fallaron
  console.error(`❌ No se pudo verificar que "${texto}" sea visible con ninguna estrategia`);
  
  // Tomar captura de pantalla
  await takeScreenshot(page, `error-verify-${texto}`);
  
  // Mostrar elementos en la página para depuración
  await logPageElements(page);
  
  throw new Error(`No se pudo verificar que "${texto}" sea visible`);
}

// Función para mostrar elementos en la página para depuración
async function logPageElements(page: Page) {
  try {
    // Mostrar enlaces
    const links = await page.locator('a').all();
    console.log(`📋 Encontrados ${links.length} enlaces en la página:`);
    for (const link of links) {
      const text = await link.textContent();
      console.log(`  - Enlace: "${text?.trim() || '(sin texto)'}"`);
    }
    
    // Mostrar botones
    const buttons = await page.locator('button').all();
    console.log(`📋 Encontrados ${buttons.length} botones en la página:`);
    for (const button of buttons) {
      const text = await button.textContent();
      console.log(`  - Botón: "${text?.trim() || '(sin texto)'}"`);
    }
    
    // Mostrar elementos con data-test-id
    const testIds = await page.locator('[data-test-id]').all();
    console.log(`📋 Encontrados ${testIds.length} elementos con data-test-id:`);
    for (const element of testIds) {
      const id = await element.getAttribute('data-test-id');
      console.log(`  - data-test-id: "${id || '(sin id)'}"`);
    }
    
    // Mostrar textos
    const texts = await page.locator('h1, h2, h3, h4, h5, h6, p, span, div').all();
    console.log(`📋 Encontrados ${texts.length} elementos de texto en la página:`);
    let textCount = 0;
    for (const text of texts) {
      const content = await text.textContent();
      if (content && content.trim()) {
        console.log(`  - Texto: "${content.trim()}"`);
        textCount++;
        // Limitar a 20 textos para no saturar la consola
        if (textCount >= 20) {
          console.log('  ... (más textos omitidos)');
          break;
        }
      }
    }
  } catch (error: any) {
    console.error(`❌ Error al mostrar elementos de la página: ${error.message}`);
  }
}

// ===== PASOS DE AUTENTICACIÓN =====

// Paso para autenticarse en la Consola
Given('Estoy autenticado en la Consola', async ({ page }: { page: Page }) => {
  // Verificar que existe el archivo de estado de autenticación
  if (!fs.existsSync(authFile)) {
    console.log('❌ No se encontró el archivo de estado de autenticación.');
    console.log('   Se creará automáticamente en la próxima ejecución.');
  } else {
    console.log('✅ Usando estado de autenticación guardado.');
  }
  
  // Navegar a la página principal para verificar que la autenticación funciona
  try {
    console.log('🌐 Navegando a la página principal...');
    await page.goto('https://internal.dev.es.ecom.dgrp.io/console-front/index.html', { timeout: 60000 });
    
    // Verificar que estamos autenticados (comprobando que el elemento userName es visible)
    try {
      await page.waitForSelector('[data-test-id="userName"]', { timeout: 10000 });
      console.log('✅ Autenticación exitosa usando estado guardado.');
    } catch (error) {
      console.log('❌ El estado de autenticación guardado ha expirado o no es válido.');
      console.log('   Se regenerará automáticamente en la próxima ejecución de las pruebas.');
      
      // Intentar hacer login manualmente
      console.log('🔄 Intentando hacer login manualmente...');
      await page.getByRole('link', { name: ' USUARIOS EXTERNOS' }).click();
      await page.getByRole('textbox', { name: 'Usuario' }).fill('QAtildes');
      await page.getByRole('textbox', { name: 'Contraseña' }).fill('tildes');
      await page.getByRole('button', { name: 'LOGIN' }).click();
      
      try {
        await page.waitForSelector('[data-test-id="userName"]', { timeout: 30000 });
        console.log('✅ Login manual exitoso.');
      } catch (error) {
        console.error('❌ Error en el login manual:', error);
        await takeScreenshot(page, 'error-login-manual');
        throw new Error('No se pudo autenticar manualmente.');
      }
    }
  } catch (error: any) {
    console.error(`❌ Error al navegar a la página principal: ${error.message}`);
    await takeScreenshot(page, 'error-navegacion-inicial');
    throw error;
  }
});

// Paso para verificar que la autenticación fue exitosa
Then('Espero que la autenticación sea exitosa', async ({ page }: { page: Page }) => {
  // Verificar que el elemento userName es visible
  await expect(page.locator('[data-test-id="userName"]')).toBeVisible();
  console.log('✅ Autenticación verificada correctamente.');
});

// ===== PASOS DE NAVEGACIÓN =====

// Paso para hacer clic en el menú
When('Hago clic en el menú', async ({ page }: { page: Page }) => {
  console.log('🖱️ Haciendo clic en el botón del menú...');
  try {
    await page.getByRole('button').filter({ hasText: /^$/ }).click();
    console.log('✅ Clic en el menú exitoso.');
  } catch (error: any) {
    console.error(`❌ Error al hacer clic en el menú: ${error.message}`);
    await takeScreenshot(page, 'error-click-menu');
    await logPageElements(page);
    throw error;
  }
});

// Paso para seleccionar una opción del menú
When('Selecciono la opción {string}', async ({ page }: { page: Page }, opcion: string) => {
  console.log(`🖱️ Seleccionando la opción "${opcion}" del menú...`);
  try {
    // Hacer clic en la opción del menú
    await page.locator(`[data-test-id="${opcion}"]`).click();
    console.log(`✅ Clic en la opción "${opcion}" exitoso.`);
    
    // Hacer clic en "Gestión de Coordinadores"
    await page.locator('[data-test-id="Gestión de Coordinadores"]').click();
    console.log('✅ Clic en "Gestión de Coordinadores" exitoso.');
    
    // Hacer clic en "Alta"
    await page.locator('[data-test-id="Alta"]').getByText('Alta').click();
    console.log('✅ Clic en "Alta" exitoso.');
  } catch (error: any) {
    console.error(`❌ Error al seleccionar la opción "${opcion}": ${error.message}`);
    await takeScreenshot(page, `error-seleccionar-${opcion}`);
    await logPageElements(page);
    throw error;
  }
});

// ===== PASOS DE VERIFICACIÓN =====

// Paso para verificar que un elemento es visible
Then('Espero que {string} sea visible', async ({ page }: { page: Page }, texto: string) => {
  console.log(`🔍 Verificando que "${texto}" sea visible...`);
  try {
    if (texto === 'Alta') {
      await expect(page.getByRole('heading', { name: 'ALTA' })).toBeVisible();
      console.log('✅ Texto "ALTA" encontrado.');
    } else {
      // Para otros textos, usar estrategia genérica
      await expect(page.getByText(texto, { exact: false })).toBeVisible();
      console.log(`✅ Texto "${texto}" encontrado.`);
    }
  } catch (error: any) {
    console.error(`❌ Error al verificar que "${texto}" sea visible: ${error.message}`);
    await takeScreenshot(page, `error-verificar-${texto}`);
    await logPageElements(page);
    throw error;
  }
});

// ===== PASOS DE INTERACCIÓN =====

// Escribir en un campo
When('Escribo {string} en el campo {string}', async ({ page }: { page: Page }, texto: string, campo: string) => {
  console.log(`⌨️ Escribiendo "${texto}" en el campo "${campo}"`);
  
  try {
    // Intentar diferentes estrategias para encontrar el campo
    try {
      await page.getByLabel(campo).fill(texto);
      return;
    } catch (error) {
      console.log(`No se pudo encontrar el campo por label: ${error}`);
    }
    
    try {
      await page.getByPlaceholder(campo).fill(texto);
      return;
    } catch (error) {
      console.log(`No se pudo encontrar el campo por placeholder: ${error}`);
    }
    
    try {
      await page.locator(`input[name="${campo}"]`).fill(texto);
      return;
    } catch (error) {
      console.log(`No se pudo encontrar el campo por name: ${error}`);
    }
    
    // Si llegamos aquí, todas las estrategias fallaron
    throw new Error(`No se pudo encontrar el campo "${campo}"`);
  } catch (error: any) {
    console.error(`❌ Error al escribir en el campo "${campo}": ${error.message}`);
    await takeScreenshot(page, `error-escribir-${campo}`);
    throw error;
  }
});

// Presionar Enter
When('Presiono Enter', async ({ page }: { page: Page }) => {
  console.log('⌨️ Presionando Enter');
  await page.keyboard.press('Enter');
}); 