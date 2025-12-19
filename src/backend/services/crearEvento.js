import { pb } from '@/backend/config/pb';

/**
 * Crea un nuevo evento asociado al usuario autenticado actual.
 * @param {Object} datos - Datos del evento a crear
 * @returns {Promise<Object>} El evento creado
 */
export async function crearEvento(datos) {
  try {
    // Obtener el usuario autenticado actual
    const user = pb.authStore.model;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Añadir el owner al evento
    const datosConOwner = {
      ...datos,
      owner: user.id
    };

    const record = await pb.collection('events').create(datosConOwner);
    return record;
  } catch (error) {
    console.error('Error al crear evento:', error);
    throw error;
  }
}
