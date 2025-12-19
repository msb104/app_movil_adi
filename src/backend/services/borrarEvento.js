import { pb } from "../config/pb.js";

// Elimina de PocketBase el evento cuyo id se recibe como parámetro.
export async function borrarEvento(id) {
  try {
    await pb.collection("events").delete(id);
  } catch (error) {
    console.error("Error al borrar evento:", error);
    throw error;
  }
}
