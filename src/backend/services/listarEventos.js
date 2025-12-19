import { pb } from '../config/pb.js';

// Devuelve únicamente los eventos cuyo owner coincide con el usuario autenticado.
export async function listarEventos() {
  if (!pb.authStore.isValid) {
    throw new Error('Sesión no válida.');
  }

  const ownerId = pb.authStore.model?.id;
  if (!ownerId) {
    throw new Error('Usuario no autenticado.');
  }

  try {
    const records = await pb.collection('events').getFullList({
      filter: `owner = "${ownerId}"`,
      sort: '-created',
    });
    return records;
  } catch (error) {
    throw error;
  }
}
