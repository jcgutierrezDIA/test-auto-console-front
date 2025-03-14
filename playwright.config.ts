import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// Configuración BDD
const bddConfig = defineBddConfig({
  paths: ['features/*.feature'],
  require: ['features/steps/*.ts'],
  outputDir: '.features-gen',
});

// Configuración de Playwright
export default defineConfig({
  testDir: '.features-gen',
  outputDir: 'test-results',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'https://internal.dev.es.ecom.dgrp.io/console-front/index.html',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    
    // Configuración de autenticación global
    storageState: 'playwright/.auth/user.json',
  },
  
  // Configuración de proyectos
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
  
  // Configuración de globalSetup
  globalSetup: './tests/auth.setup.ts',
}); 