const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para crear un archivo .feature
function createFeatureFile(name, tag, description) {
  const featurePath = path.join(__dirname, 'features', `${name}.feature`);
  
  const featureContent = `Feature: ${description}
  Como usuario de la Consola
  Quiero ${description.toLowerCase()}
  Para mejorar mi experiencia en la plataforma

  @${tag}
  Scenario: ${description}
    Given Estoy autenticado en la Consola
    When Hago clic en el menú
    And Selecciono la opción "Panel de Transporte"
    Then Espero que "Alta" sea visible
`;
  
  fs.writeFileSync(featurePath, featureContent);
  console.log(`✅ Archivo .feature creado en: ${featurePath}`);
}

// Función para actualizar package.json
function updatePackageJson(tag) {
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = require(packagePath);
  
  // Añadir nuevos scripts si no existen
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  // Añadir scripts para el nuevo test
  packageJson.scripts[`test:${tag}`] = `npx playwright-bdd test --tags @${tag} && npx playwright test`;
  packageJson.scripts[`ui:${tag}`] = `npx playwright-bdd test --tags @${tag} && npx playwright test --ui`;
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Scripts añadidos a package.json: test:${tag} y ui:${tag}`);
}

// Función principal
function createTest() {
  console.log('🚀 Generador de Tests para la Consola\n');
  
  rl.question('Nombre del archivo (sin extensión, ej: usuarios): ', (name) => {
    rl.question('Etiqueta para el test (sin @, ej: users): ', (tag) => {
      rl.question('Descripción de la funcionalidad: ', (description) => {
        console.log('\nCreando archivos...');
        
        createFeatureFile(name, tag, description);
        updatePackageJson(tag);
        
        console.log('\n✨ Test creado correctamente!');
        console.log('\nPara ejecutar tu test:');
        console.log(`- Terminal: npm run test:${tag}`);
        console.log(`- UI: npm run ui:${tag}`);
        
        console.log('\nEl test creado sigue el flujo básico de navegación al Panel de Transporte.');
        console.log('Si necesitas modificarlo, edita el archivo .feature creado.');
        
        rl.close();
      });
    });
  });
}

createTest(); 