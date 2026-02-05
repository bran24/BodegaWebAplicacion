import { TipoDocumento } from '../api/types';

/**
 * Verifica si el tipo de documento seleccionado es RUC
 * @param tipoDocumentoId - ID del tipo de documento seleccionado
 * @param tiposDocumento - Array de tipos de documento disponibles
 * @returns true si es RUC, false en caso contrario
 */
export const esRUC = (
    tipoDocumentoId: string | undefined,
    tiposDocumento: TipoDocumento[] | undefined
): boolean => {
    if (!tipoDocumentoId || !tiposDocumento) return false;

    const tipoDoc = tiposDocumento.find(td => td.id.toString() === tipoDocumentoId);
    return tipoDoc?.nombre.toUpperCase().includes("RUC") ?? false;
};

/**
 * Verifica si el tipo de documento seleccionado es DNI
 * @param tipoDocumentoId - ID del tipo de documento seleccionado
 * @param tiposDocumento - Array de tipos de documento disponibles
 * @returns true si es DNI, false en caso contrario
 */
export const esDNI = (
    tipoDocumentoId: string | undefined,
    tiposDocumento: TipoDocumento[] | undefined
): boolean => {
    if (!tipoDocumentoId || !tiposDocumento) return false;

    const tipoDoc = tiposDocumento.find(td => td.id.toString() === tipoDocumentoId);
    return tipoDoc?.nombre.toUpperCase().includes("DNI") ?? false;
};

/**
 * Obtiene el nombre del tipo de documento
 * @param tipoDocumentoId - ID del tipo de documento
 * @param tiposDocumento - Array de tipos de documento disponibles
 * @returns Nombre del tipo de documento o undefined si no se encuentra
 */
export const getNombreTipoDocumento = (
    tipoDocumentoId: string | undefined,
    tiposDocumento: TipoDocumento[] | undefined
): string | undefined => {
    if (!tipoDocumentoId || !tiposDocumento) return undefined;

    const tipoDoc = tiposDocumento.find(td => td.id.toString() === tipoDocumentoId);
    return tipoDoc?.nombre;
};

/**
 * Valida la longitud del número de documento según el tipo
 * @param tipoDocumentoId - ID del tipo de documento
 * @param numeroDocumento - Número de documento a validar
 * @param tiposDocumento - Array de tipos de documento disponibles
 * @returns true si la longitud es válida, false en caso contrario
 */
export const validarLongitudDocumento = (
    tipoDocumentoId: string | undefined,
    numeroDocumento: string | undefined,
    tiposDocumento: TipoDocumento[] | undefined
): boolean => {
    if (!numeroDocumento || !tipoDocumentoId || !tiposDocumento) return false;

    if (esRUC(tipoDocumentoId, tiposDocumento)) {
        return numeroDocumento.length === 11;
    }

    if (esDNI(tipoDocumentoId, tiposDocumento)) {
        return numeroDocumento.length === 8;
    }

    return true; // Para otros tipos de documento, no validamos longitud
};

export const roundToTwoDecimals = (num: number): number => {

    return +(num.toFixed(2));
};
