import { test } from '../../tests/fixtures';
import { createBdd } from 'playwright-bdd';

// Exportar los métodos Given, When, Then para los pasos de BDD
export const { Given, When, Then } = createBdd(test); 