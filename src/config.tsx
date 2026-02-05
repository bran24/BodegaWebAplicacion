export const API_URL: string = import.meta.env.VITE_PROD_API;
export const API_TKEY: string = import.meta.env.VITE_TKEY;
export const PUBLIC_KEY_MERCADOPAGO: string = (import.meta.env.VITE_PUBLIC_KEY_MERCADOPAGO || '')
    .replace(/['";]/g, '') // Elimina comillas simples, dobles y puntos y coma
    .trim();
import logoBodeBrand from './assets/img/bodebrand.png';
export const COMPANY_INFO = {
    nombre: "BodeBrand",
    ruc: "20600000001",
    direccion: "Manuel Cedeño 1100, Trujillo",
    telefono: "9127011325",
    email: "contacto@mibodega.com",
    logo: logoBodeBrand // Ruta en carpeta public o URL externa
};
