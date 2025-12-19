import PocketBase from "pocketbase";

// Cliente compartido de PocketBase configurado para apuntar al backend local.
// Se exporta como singleton para reutilizar sesión y listeners en toda la app.
export const pb = new PocketBase('https://msb104.duckdns.org');