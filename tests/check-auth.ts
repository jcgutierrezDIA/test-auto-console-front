import fs from 'fs';
import path from 'path';

// Ruta al archivo de estado de autenticación
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

// Función para verificar el estado de autenticación
function checkAuth() {
  console.log('Verificando estado de autenticación...');
  
  // Verificar si existe el archivo
  if (!fs.existsSync(authFile)) {
    console.log('❌ No se encontró el archivo de estado de autenticación.');
    console.log('   Ejecuta "npm run auth" para crear uno nuevo.');
    return;
  }
  
  try {
    // Leer el archivo
    const fileContent = fs.readFileSync(authFile, 'utf-8');
    const authData = JSON.parse(fileContent);
    
    // Verificar si hay cookies guardadas
    const hasCookies = authData.cookies && authData.cookies.length > 0;
    
    // Obtener la edad del archivo
    const fileStats = fs.statSync(authFile);
    const fileAgeHours = (Date.now() - fileStats.mtimeMs) / (1000 * 60 * 60);
    
    console.log(`✅ Archivo de estado encontrado (${fileAgeHours.toFixed(2)} horas de antigüedad).`);
    console.log(`   Cookies guardadas: ${authData.cookies ? authData.cookies.length : 0}`);
    console.log(`   Origins guardados: ${authData.origins ? authData.origins.length : 0}`);
    
    if (!hasCookies) {
      console.log('⚠️ No hay cookies guardadas en el archivo de estado.');
      console.log('   Esto puede causar problemas de autenticación en las pruebas.');
      console.log('   Ejecuta "npm run auth" para regenerar el estado de autenticación.');
    } else if (fileAgeHours > 12) {
      console.log('⚠️ El archivo de estado tiene más de 12 horas de antigüedad.');
      console.log('   Considera ejecutar "npm run auth" para regenerarlo.');
    } else {
      console.log('✅ El estado de autenticación parece válido.');
    }
  } catch (error) {
    console.error('❌ Error al leer el archivo de estado de autenticación:', error);
    console.log('   Ejecuta "npm run auth" para crear uno nuevo.');
  }
}

// Ejecutar la función
checkAuth(); 