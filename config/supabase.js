const { createClient } = require('@supabase/supabase-js');

// Les valeurs viennent du fichier .env (chargé dans index.js)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Si une valeur manque, on arrête tout de suite avec un message clair
if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être remplis dans le fichier .env');
}

// Client Supabase : c'est l'objet qu'on utilise pour lire et écrire dans la base.
// Côté serveur, pas de session utilisateur à garder ni à rafraîchir.
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = supabase;
