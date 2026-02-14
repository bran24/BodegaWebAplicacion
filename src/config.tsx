export const API_URL: string = import.meta.env.VITE_PROD_API;
export const API_TKEY: string = import.meta.env.VITE_TKEY;
export const PUBLIC_KEY_MERCADOPAGO: string = (import.meta.env.VITE_PUBLIC_KEY_MERCADOPAGO || '')
    .replace(/['";]/g, '') // Elimina comillas simples, dobles y puntos y coma
    .trim();
import logoBodeBrand from './assets/img/bodebrand.webp';
import logoBodeBrandpdf from './assets/img/bodebrand_pdf.webp';
export const COMPANY_INFO = {
    nombre: "BodeBrand",
    ruc: "20600000001",
    direccion: "Manuel Cedeño 1100, Trujillo",
    telefono: "987654321",
    email: "contacto@mibodega.com",
    logo: logoBodeBrand,
    logo_pdf: logoBodeBrandpdf

};

export const API_MERCADOPAGO_YAPE: string = import.meta.env.VITE_API_MERCADOPAGO_YAPE;
