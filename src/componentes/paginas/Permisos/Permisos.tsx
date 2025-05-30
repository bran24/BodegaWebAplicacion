import React, { useState } from 'react';
import { PermisosporTipo } from '../../../api/types';
import withFetch from './withFetch';
import Loader2 from '../../atomos/Loader/loader2';
import { FaChevronDown } from '../../../assets/icon/icons';
import { FaChevronUp } from 'react-icons/fa';

interface PermisosTableProps {
    datos: PermisosporTipo[] | undefined;
    load: boolean;
    err: unknown;
}

const PermisosTable: React.FC<PermisosTableProps> = ({ datos, load, err }) => {
    const [visibleTipos, setVisibleTipos] = useState<number[]>([]); // Estado para manejar qué tipos son visibles

    const toggleTipo = (id: number) => {
        setVisibleTipos(prev =>
            prev.includes(id) ? prev.filter(tipoId => tipoId !== id) : [...prev, id]
        );
    };

    if (load) return <Loader2 />;
    if (err) return <p className='text-4xl'>Error al cargar los datos: {JSON.stringify(err)}</p>;
    if (!datos || datos.length === 0) return <p>No hay permisos disponibles.</p>;

    return (
        <div className="w-full max-w-full h-screen rounded-sm border bg-white p-3">
            <p className='font-semibold text-4xl my-4'>Permisos</p>
            <div className='max-h-80 overflow-auto'>
                <table className="table-auto border shadow-sm border-secundary4 w-full bg-white text-center">
                    <thead>
                        <tr>
                            <th className='border border-secundary4'>Permiso</th>
                            <th className='border border-secundary4'>Descripcion</th>
                            <th className='border border-secundary4'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map(tipo => (
                            <React.Fragment key={tipo.id}>
                                <tr >
                                    <td className='border border-secundary4 bg-secundary2 font-medium'>{tipo.nombre}

                                    </td>
                                    <td className='border border-secundary4  bg-secundary2 '>{tipo.descripcion}

                                    </td>
                                    <td onClick={() => toggleTipo(tipo.id)} className='border-t border-secundary4 cursor-pointer hover:bg-secundary2'>
                                        <div className='flex justify-center  align-middle'>
                                            {visibleTipos.includes(tipo.id) ? < FaChevronDown /> : < FaChevronUp />}
                                        </div>

                                    </td>
                                </tr>
                                {visibleTipos.includes(tipo.id) && (
                                    tipo.permisos.map(permiso => (
                                        <tr key={permiso.id}>
                                            <td className='border border-secundary4 pl-10'>
                                                {permiso.nombre}

                                            </td>
                                            <td className='border border-secundary4'>
                                                {permiso.descripcion}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PagePermisos = withFetch(PermisosTable);
export default PagePermisos;