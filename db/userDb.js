// Accès aux données : toutes les requêtes sur la table "users" sont ici.
// Le controller appelle ces fonctions sans savoir comment les données sont stockées.
// En cas de problème avec la base, chaque fonction lance (throw) l'erreur de Supabase.
const supabase = require('./supabaseClient');

// Tous les utilisateurs, triés par id
const findAll = async () => {
  const { data, error } = await supabase.from('users').select('*').order('id');
  if (error) throw error;
  return data;
};

// Un utilisateur selon son id, ou null s'il n'existe pas
const findById = async (id) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
};

// Crée un utilisateur et le renvoie (avec l'id généré par la base)
const create = async ({ nom, age, ville }) => {
  const { data, error } = await supabase.from('users').insert({ nom, age, ville }).select().single();
  if (error) throw error;
  return data;
};

// Modifie un utilisateur et le renvoie, ou null s'il n'existe pas
const update = async (id, { nom, age, ville }) => {
  const { data, error } = await supabase
    .from('users')
    .update({ nom, age, ville })
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
};

// Supprime un utilisateur et le renvoie, ou null s'il n'existait pas
const remove = async (id) => {
  const { data, error } = await supabase.from('users').delete().eq('id', id).select().maybeSingle();
  if (error) throw error;
  return data;
};

module.exports = { findAll, findById, create, update, remove };
