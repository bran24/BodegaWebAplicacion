import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../config.tsx'
import { Cliente,ClienteResponse,ClientePagResponse,Categoria, CategoriaResponse, PermisosporTipo, PermisosResponse, ProductPagResponse, Roles, rolPermisos, RolPermisosResponse, RolResponse, Unidad, UnidadResponse, UsuarioPagResponse,Proveedor,ProveedorPagResponse,ProveedorResponse, TipoDocumento, TiDocResponse, VentaPagResponse, VentaIdResponse, VentaId, Venta, MetodoPago, MetodoPagoResponse, TipoComprobante, TipoComprobanteResponse, ProximoNumero, ProximoNumeroResponse } from './types';
import { handleDecrypt } from '../utils/Encriptacion.tsx';
// Define a service using a base URL and expected endpoints




const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { endpoint }) => {


        const token = localStorage.getItem('token');


        if (token && endpoint !== 'apilogin') {

            headers.set('Authorization', `Bearer ${handleDecrypt(token)}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['getProductos','getTipoComprobante','getMetodoPago','getUnidad', 'getCategoria', 'getPagProductos', 'getPermisos', 'getRoles', 'getUsuarios','getProveedor','getPagProveedor','getCliente','getPagCliente','getTipoDoc','getVentaId','getPagVentas'],
    endpoints: (builder) => ({
        apiLogin: builder.mutation({
            query: (newTask) => ({
                url: "/login",
                method: "POST",
                body: newTask
            })
        }),
        apiCrearUsuario: builder.mutation({
            query: (newTask) => ({
                url: "/usuario",
                method: "POST",
                body: newTask
            }),
            invalidatesTags: ['getUsuarios']
        }),





        apiObtenerUsuariosPaginacion: builder.query<UsuarioPagResponse, { page: number, limit: number }>({
            query: ({ page, limit }) => `/usuario?page=${page}&limit=${limit}`,

            providesTags: ['getUsuarios'],

        }),



        apiActualizarUsuario: builder.mutation({
            query: (newtask) => ({ url: "usuario", method: "PUT", body: newtask }),
            invalidatesTags: ['getUsuarios']

        }),


        apiEliminarUsuario: builder.mutation({
            query: (id) => ({
                url: `usuario/${id}`, // Incluye el ID del producto en la URL
                method: "DELETE",
            }),
            invalidatesTags: ['getUsuarios']
        }),





        // apiObtenerProductos: builder.query<Product[], void>({
        //     query: () => '/productos',
        //     transformResponse: (response: ProductResponse) => response.result,
        //     providesTags: ['getProductos'],
        // }),


        apiObtenerRoles: builder.query<Roles[], void>({
            query: () => '/rol',
            transformResponse: (response: RolResponse) => response.result,
            providesTags: ['getRoles']


        }),





        apiObtenerPermisos: builder.query<PermisosporTipo[], void>({
            query: () => '/permiso',
            transformResponse: (response: PermisosResponse) => response.result,
            providesTags: ['getPermisos']



        }),

        apiObtenerRolPermisos: builder.query<rolPermisos[], void>({
            query: () => '/rolPermiso',
            transformResponse: (response: RolPermisosResponse) => response.result,



        }),


        apiObtenerPermisosPorRol: builder.mutation<rolPermisos[], number>({
            query: (id) => ({
                url: `rolPermiso/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: RolPermisosResponse) => response.result,
        }),




        apiRegistrarRol: builder.mutation({
            query: (newtask) => ({ url: "rol", method: "POST", body: newtask }),
            invalidatesTags: ['getRoles']

        }),

        // apiRegistrarPermiso: builder.mutation({
        //     query: (newtask) => ({ url: "permiso", method: "POST", body: newtask }),
        //     invalidatesTags: ['getPermisos']

        // }),


        // apiEliminarPermiso: builder.mutation({
        //     query: (id) => ({
        //         url: `permiso/${id}`, // Incluye el ID del producto en la URL
        //         method: "DELETE",

        //     }),
        //     invalidatesTags: ['getPermisos']

        // }),




        apiRegistrarRolPermiso: builder.mutation({
            query: (newtask) => ({ url: "rolPermiso", method: "POST", body: newtask }),

        }),


        apiActualizarRolPermiso: builder.mutation({
            query: (newtask) => ({ url: "rolPermiso", method: "PUT", body: newtask }),

        }),

        apiEliminarRolPermiso: builder.mutation({
            query: (id) => ({
                url: `rolPermiso/${id}`, // Incluye el ID del producto en la URL
                method: "DELETE",

            }),
            invalidatesTags: ['getRoles']

        }),




        apiEliminarRol: builder.mutation({
            query: (id) => ({
                url: `rol/${id}`, // Incluye el ID del producto en la URL
                method: "DELETE",

            }),
            invalidatesTags: ['getRoles']

        }),



        apiActualizarRol: builder.mutation({
            query: (newtask) => ({ url: "rol", method: "PUT", body: newtask }),
            invalidatesTags: ['getRoles']

        }),


        apiActualizarPermiso: builder.mutation({
            query: (newtask) => ({ url: "permiso", method: "PUT", body: newtask }),
            invalidatesTags: ['getPermisos']

        }),






        apiObtenerUnidad: builder.query<Unidad[], void>({
            query: () => '/unidad',
            transformResponse: (response: UnidadResponse) => response.result,
            providesTags: ['getUnidad'],
        }),
        apiObtenerCategoria: builder.query<Categoria[], void>({
            query: () => '/categoria',
            transformResponse: (response: CategoriaResponse) => response.result,
            providesTags: ['getCategoria'],
        }),

        apiObtenerProveedor: builder.query<Proveedor[], void>({
            query: () => '/proveedor',
            transformResponse: (response: ProveedorResponse) => response.result,
            providesTags: ['getProveedor'],
        }),



        apiRegistrarProveedor: builder.mutation({
            query: (newtask) => ({ url: "proveedor", method: "POST", body: newtask }),
            invalidatesTags: ['getPagProveedor']
        }),

        apiActualizarProveedor: builder.mutation({
            query: (newtask) => ({ url: "proveedor", method: "PUT", body: newtask }),
            invalidatesTags: ['getPagProveedor']
        }),



        apiEliminarProveedor: builder.mutation({
            query: (id) => ({
                url: `proveedor/${id}`, // Incluye el ID del producto en la URL
                method: "DELETE",
            }),
            invalidatesTags: ['getPagProveedor'],
        }),

        
           apiObtenerProveedorPaginacion: builder.query<ProveedorPagResponse, { page: number, limit: number }>({
            query: ({ page, limit }) => `/proveedorpag?page=${page}&limit=${limit}`,

            providesTags: ['getPagProveedor'],

        }),

        


        apiRegistrarProductos: builder.mutation({
            query: (newtask) => ({ url: "productos", method: "POST", body: newtask }),
            invalidatesTags: ['getPagProductos']
        }),

        apiActualizarProductos: builder.mutation({
            query: (newtask) => ({ url: "productos", method: "PUT", body: newtask }),
            invalidatesTags: ['getPagProductos']
        }),

        apiEliminarProductos: builder.mutation({
            query: (id) => ({
                url: `productos/${id}`, // Incluye el ID del producto en la URL
                method: "DELETE",
            }),
            invalidatesTags: ['getPagProductos'],
        }),
        apiObtenerProductosPaginacion: builder.query<ProductPagResponse, { page: number, limit: number }>({
            query: ({ page, limit }) => `/productospag?page=${page}&limit=${limit}`,

            providesTags: ['getPagProductos'],

        }),
        

           apiObtenerCliente: builder.query<Cliente[], void>({
            query: () => '/cliente',
            transformResponse: (response: ClienteResponse) => response.result,
            providesTags: ['getCliente'],
        }),

        apiRegistrarCliente: builder.mutation({
            query: (newtask) => ({ url: "cliente", method: "POST", body: newtask }),
            invalidatesTags: ['getPagCliente']
        }),

        apiActualizarCliente: builder.mutation({
            query: (newtask) => ({ url: "cliente", method: "PUT", body: newtask }),
            invalidatesTags: ['getPagCliente']
        }),



        apiEliminarCliente: builder.mutation({
            query: (id) => ({
                url: `cliente/${id}`, // Incluye el ID del producto en la URL
                method: "DELETE",
            }),
            invalidatesTags: ['getPagCliente'],
        }),

        
           apiObtenerClientePaginacion: builder.query<ClientePagResponse, { page: number, limit: number }>({
            query: ({ page, limit }) => `/clientepag?page=${page}&limit=${limit}`,

            providesTags: ['getPagCliente'],

        }),


        apiObtenerTipoDoc: builder.query<TipoDocumento[], void>({
            query: () => '/tipodoc',
            transformResponse: (response: TiDocResponse) => response.result,
            providesTags: ['getTipoDoc'],
          
        }),


                 apiObtenerVentasPaginacion: builder.query<VentaPagResponse, { page: number, limit: number }>({
            query: ({ page, limit }) => `/ventaspag?page=${page}&limit=${limit}`,

            providesTags: ['getPagVentas'],

        }),


             apiObtenerVenta: builder.query<Venta, void>({
            query: () => '/venta',
            transformResponse: (response: VentaIdResponse) => response.result,
            providesTags: ['getVentaId'],
        }),



        apiRegistrarVenta: builder.mutation({
            query: (newtask) => ({ url: "venta", method: "POST", body: newtask }),
            invalidatesTags: ['getPagVentas']
        }),

        
        apiActualizarEstadoVenta: builder.mutation({
            query: (newtask) => ({ url: "facturarventa", method: "POST", body: newtask }),
            invalidatesTags: ['getPagVentas']
        }),


        
        apiObtenerMetodoPago: builder.query<MetodoPago[], void>({
            query: () => '/metodopagos',
            transformResponse: (response: MetodoPagoResponse) => response.result,
            providesTags: ['getMetodoPago'], 
           
        }),


                apiObtenerTipoComprobante: builder.query<TipoComprobante[], void>({
            query: () => '/tipocomprobantes',
            transformResponse: (response: TipoComprobanteResponse) => response.result,
            providesTags: ['getTipoComprobante'],
          
        }),


        


          apiObtenerProximoNumero: builder.query<ProximoNumero, void>({
            query: () => '/venta/proximo-numero',
            transformResponse: (response: ProximoNumeroResponse) => response.result,
        
        }),


   



    }),
})

export const {useApiObtenerProximoNumeroQuery,useApiObtenerMetodoPagoQuery,useApiObtenerTipoComprobanteQuery,useApiObtenerVentaQuery,useApiObtenerVentasPaginacionQuery,useApiRegistrarVentaMutation,useApiActualizarEstadoVentaMutation ,useApiObtenerTipoDocQuery,useApiRegistrarClienteMutation,useApiObtenerClienteQuery,useApiObtenerClientePaginacionQuery,useApiActualizarClienteMutation,useApiEliminarClienteMutation,useApiObtenerProveedorQuery,useApiObtenerProveedorPaginacionQuery,useApiRegistrarProveedorMutation,useApiActualizarProveedorMutation,useApiEliminarProveedorMutation,useApiLoginMutation, useApiCrearUsuarioMutation, useApiRegistrarProductosMutation, useApiObtenerCategoriaQuery, useApiObtenerUnidadQuery, useApiActualizarProductosMutation, useApiEliminarProductosMutation, useApiObtenerProductosPaginacionQuery, useApiEliminarRolMutation, useApiObtenerPermisosQuery, useApiObtenerRolesQuery, useApiObtenerRolPermisosQuery, useApiRegistrarRolMutation, useApiRegistrarRolPermisoMutation, useApiActualizarPermisoMutation, useApiActualizarRolMutation, useApiEliminarUsuarioMutation, useApiActualizarUsuarioMutation, useApiObtenerUsuariosPaginacionQuery, useApiObtenerPermisosPorRolMutation, useApiActualizarRolPermisoMutation, useApiEliminarRolPermisoMutation } = apiSlice