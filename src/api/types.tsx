export interface Unidad {
    id: number;
    nombre: string;
    abreviatura: string;
}

export interface Usuario {
    id: number;
    username: string;
    email: string;
    password: string;
    rol: Roles



}



export interface Categoria {
    id: number;
    nombre: string;
}

export interface Product {
    id: number;
    nombre: string;
    descripcion?: string;
    precioCompra: string;
    precioVenta: string;
    unidad: Unidad;
    categoria: Categoria;
    cantidad: number;
    isActive: boolean;
    fechaVencimiento?: string; // Puede ser Date si prefieres trabajar con objetos Date
    fecha_creacion: string; // Puede ser Date
    fecha_actualizacion: string; // Puede ser Date
}

export interface Roles {
    id: number,
    nombre: string,
    descripcion: string,
    fecha_creacion: string; // Puede ser Date
    fecha_actualizacion: string; // Puede ser Date




}


export interface Permisos {
    id: number,
    nombre: string,
    descripcion: string,


}

export interface PermisosporTipo {
    id: number,
    nombre: string,
    descripcion: string,
    permisos: Permisos[]


}


export interface rolPermisos {
    id: number,
    rol?: Roles,
    permiso?: Permisos,
    fecha_creacion: string; // Puede ser Date
    fecha_actualizacion: string; // Puede ser Date


}




export interface RolResponse {
    result: Roles[];
}

export interface PermisosResponse {
    result: PermisosporTipo[];
}


export interface RolPermisosResponse {
    result: rolPermisos[];
}







export interface ProductResponse {
    result: Product[];
}




export interface UnidadResponse {
    result: Unidad[];
}

export interface CategoriaResponse {
    result: Categoria[];
}


export interface ProductPagResponse {
    productos: Product[];
    totalItems: number;
    totalPages: number;
    currentPage: number;

}

export interface UsuarioPagResponse {
    usuarios: Usuario[];
    totalItems: number;
    totalPages: number;
    currentPage: number;

}