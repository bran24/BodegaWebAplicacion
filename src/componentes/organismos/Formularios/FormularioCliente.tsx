import React, { useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { TipoDocumento } from '../../../api/types';
import { FaBox, MdEmail, MdOutlineLocalPhone } from '../../../assets/icon/icons';
import FormTextInput from '../../atomos/formInputs/formTextInput';
import Dropdown from '../../atomos/formInputs/dropdown';
import { esRUC } from '../../../utils/documentHelpers';
import SwitchCustom from '../../atomos/checkbox/switchCustom';

export interface ClienteFormData {
    nombre: string;
    tipo_documento?: string;
    numero_documento?: string;
    direccion: string;
    correo: string;
    telefono: string;
    es_empresa?: boolean;
}

interface FormularioClienteProps {
    register: UseFormRegister<ClienteFormData>;
    errors: FieldErrors<ClienteFormData>;
    tipodocumentos?: TipoDocumento[];
    tipoDocumentoSeleccionado?: string;
    setValue: UseFormSetValue<ClienteFormData>;
}

const FormularioCliente: React.FC<FormularioClienteProps> = ({
    register,
    errors,
    tipodocumentos,
    tipoDocumentoSeleccionado,
    setValue
}) => {
    const prevTipoDocumento = React.useRef<string | undefined>(undefined);

    // Resetear es_empresa cuando el USUARIO cambia el tipo de documento a uno que NO es RUC
    useEffect(() => {
        // Si es la primera vez que se establece el valor, solo guardarlo
        if (prevTipoDocumento.current === undefined) {
            prevTipoDocumento.current = tipoDocumentoSeleccionado;
            return;
        }

        // Si el tipo de documento cambió (el usuario lo cambió manualmente)
        if (prevTipoDocumento.current !== tipoDocumentoSeleccionado) {
            prevTipoDocumento.current = tipoDocumentoSeleccionado;

            // Si el nuevo tipo NO es RUC, resetear es_empresa
            if (!esRUC(tipoDocumentoSeleccionado, tipodocumentos)) {
                setValue('es_empresa', false);
            }
        }
    }, [tipoDocumentoSeleccionado, tipodocumentos]); // setValue es estable y no necesita estar en las dependencias
    return (
        <div>
            <FormTextInput
                inputName="nombre"
                title="Nombre"
                icon={<FaBox />}
                placeholder="Ingresar Cliente"
                options={{
                    required: {
                        value: true,
                        message: 'Cliente requerido',
                    },
                    pattern: {
                        value: /^[a-zA-Z0-9 áéíóúüÁÉÍÓÚÜñÑ.,-]+$/,
                        message: 'Nombre invalido',
                    },
                    maxLength: {
                        value: 50,
                        message: 'No más de 50 caracteres.',
                    },
                }}
                register={register}
                errors={errors.nombre}
                type='text'
            />

            <Dropdown
                options={{
                    required: { value: true, message: 'Tipo de Documento requerido' }
                }}
                register={register}
                errors={errors.tipo_documento}
                title='Tipo Documento'
                placeholder='Seleccione Documento'
                inputName='tipo_documento'
                icon={<FaBox />}
            >
                {Array.isArray(tipodocumentos) &&
                    tipodocumentos.map((item) => (
                        <option
                            key={item.id}
                            value={item.id}
                            className="capitalize text-gray-700"
                        >
                            {item.nombre}
                        </option>
                    ))}
            </Dropdown>

            <FormTextInput
                inputName="numero_documento"
                title="Numero de Documento"
                icon={<FaBox />}
                placeholder="Ingresar numero de documento"
                options={{
                    required: { value: true, message: 'Numero de documento requerido' }
                }}
                register={register}
                errors={errors.numero_documento}
                type='text'
            />
            {/* Checkbox "Es Empresa" - Solo se muestra si selecciona RUC */}
            {esRUC(tipoDocumentoSeleccionado, tipodocumentos) && (
                <div className="flex my-4 p-1  border border-blue-200 rounded">
                    <SwitchCustom register={register} errors={errors.es_empresa} title='¿Es una Empresa?' name='es_empresa' />

                </div>
            )}

            <FormTextInput
                inputName="telefono"
                title="Telefono"
                type="text"
                icon={<MdOutlineLocalPhone />}
                placeholder="Ingresar Telefono"
                options={{
                    pattern: {
                        value: /^\d{9}$/,
                        message: 'Teléfono inválido: debe tener 9 dígitos',
                    },
                }}
                register={register}
                errors={errors.telefono}
            />

            <FormTextInput
                inputName="correo"
                title="Correo"
                type=""
                icon={<MdEmail />}
                placeholder="Ingresar Correo"
                options={{
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Correo invalido',
                    },
                }}
                register={register}
                errors={errors.correo}
            />

            <FormTextInput
                inputName="direccion"
                title="Direccion"
                icon={<FaBox />}
                placeholder="Ingresar Direccion"
                options={{}}
                register={register}
                errors={errors.direccion}
                type='text'
            />
        </div>
    );
};

export default FormularioCliente;
