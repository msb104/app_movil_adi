import PocketBase from "pocketbase";

// Cliente compartido de PocketBase configurado para apuntar al backend local.
// Se exporta como singleton para reutilizar sesión y listeners en toda la app.
export const pb = new PocketBase('https://20.240.219.184:8090');