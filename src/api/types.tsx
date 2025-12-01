

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

export interface TipoDocumento{
    id:number;
    nombre:string;
    descripcion:string


}

export interface TiDocResponse{
    result: TipoDocumento[];
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
    afecta_igv:boolean;
    unidad: Unidad;
    categoria: Categoria;
    proveedor: Proveedor;
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

export interface Proveedor {
    id: number;
    nombre: string;
    descripcion?: string;
    contacto?: string;
    email: string;
    telefono: string;
    direccion: string;
    pais: string

}





export interface ProveedorResponse {
    result: Proveedor[];
}




export interface ProveedorPagResponse {
    proveedores: Proveedor[];
    totalItems: number;
    totalPages: number;
    currentPage: number;

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
















export interface Cliente {
    id: number;
    nombre: string;
    tipo_documento?: TipoDocumento;
    numero_documento?: string;
    direccion?: string;
    correo?: string;
    telefono?: string;
    es_empresa: boolean

}





export interface ClienteResponse {
    result: Cliente[];
}




export interface ClientePagResponse {
    clientes: Cliente[];
    totalItems: number;
    totalPages: number;
    currentPage: number;

}




export interface VentaPag {
  id: number;
  fecha_venta: string;          // Date en formato ISO que llega como string
  fecha_facturacion: string | null;
  fecha_creacion: string;
  estado: string;
  total: number;
  serie: string;
  numero: string;
  cliente: {
    id: number;
    nombre: string;
  };

  tipo_comprobante: {
    id: number;
    nombre: string;
  };


}




export interface VentaPagResponse {
    ventas:  VentaPag[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}


export interface VentaIdResponse {
    result: Venta;
}




export interface Venta {
  id: number;
  fecha_venta: string;
  fecha_facturacion: string | null;
  fecha_creacion: string;
  serie: string;
  numero: number;
  total: string;
  estado: string;
  observacion: string | null;
  cliente: ClienteResponse;
  usuario: UsuarioResponse;
  tipo_comprobante: TipoComprobanteResponse;
  detalleVentas: DetalleVentaResponse[];
  pagos: PagoResponse[];
}

// --- Relaciones ---

export interface ClienteResponse {
  id: number;
  nombre: string;
}

export interface UsuarioResponse {
  id: number;
  username: string;
}


export interface TipoComprobanteResponse {
    result: TipoComprobante[];
}

export interface TipoComprobante {
  id: number;
  nombre: string;
  codigo_sunat: string;
  serie: string;
}

export interface DetalleVentaResponse {
  id: number;
  precio_unitario: string;
  cantidad: number;
  subtotal: string;
  afecta_igv: boolean;
  igv: string;
  total: string;
  producto: ProductoResponse;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  precioVenta: string;
}

export interface PagoResponse {
  id: number;
  fecha: string;
  monto: string;
  vuelto: string;
  observacion: string | null;
  metodoPago: MetodoPago;
}

export interface MetodoPago {
  id: number;
  nombre: string;
}



export interface MetodoPagoResponse {
    result: MetodoPago[];
}


export interface ProximoNumero {
    serie: string;
    siguiente_numero :number;
}



export interface ProximoNumeroResponse {
 result: ProximoNumero
}


