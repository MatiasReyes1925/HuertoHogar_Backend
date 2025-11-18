require('dotenv').config();
const supabase = require('./config/supabase');

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*');
    
    if (error) {
      console.error('Error conectando a Supabase:', error);
    } else {
      console.log('✅ Conexión exitosa a Supabase!');
      console.log('Roles encontrados:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testConnection();
