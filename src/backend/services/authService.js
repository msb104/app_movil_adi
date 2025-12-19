import { pb } from '../config/pb.js';

// Intenta autenticar con email/contraseña; valida entradas antes de delegar en PocketBase.
const login = async function (email, password) {
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();

  if (!trimmedEmail || !trimmedPassword) {
    throw new Error('Debes indicar email y contraseña.');
  }

  return pb.collection('users').authWithPassword(trimmedEmail, trimmedPassword);
};

// Alta de usuario en PocketBase; comprueba campos obligatorios y confirma contraseñas.
const register = async function (name, email, password, confirmPassword) {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();
  const trimmedConfirm = confirmPassword?.trim();

  if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirm) {
    throw new Error('Debes indicar nombre, email y contraseña.');
  }

  if (trimmedPassword !== trimmedConfirm) {
    throw new Error('Las contraseñas no coinciden.');
  }

  return pb.collection('users').create({
    name: trimmedName,
    email: trimmedEmail,
    password: trimmedPassword,
    passwordConfirm: trimmedConfirm,
  });
};

// Elimina al usuario autenticado actualmente y limpia la sesión local.
const deleteUser = async () => {
  if (!pb.authStore.isValid) {
    throw new Error('No hay sesión activa.');
  }

  const userId = pb.authStore.model?.id;

  if (!userId) {
    throw new Error('Usuario actual no encontrado.');
  }

  await pb.collection('users').delete(userId);
  pb.authStore.clear();
};

// Cierra sesión local borrando tokens guardados.
const logout = () => {
  pb.authStore.clear();
};

// Devuelve si la sesión guardada es válida.
const isAuthenticated = () => pb.authStore.isValid;

// Recupera el modelo completo del usuario autenticado (o null si no hay sesión).
const getCurrentUser = () => (pb.authStore.isValid ? pb.authStore.model : null);

export { login, logout, isAuthenticated, getCurrentUser, register, deleteUser };
