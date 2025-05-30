/* eslint-disable linebreak-style */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable quotes */
/* eslint-disable prefer-template */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';
import { useState } from 'react';
import { IconMinus, IconPlus } from '../../../assets/icons/icons';
import {
  errorAlert,
  infoAlert,
  successAlert,
  warningAlert,
} from '../../../../src/utils/alertNotify';

const ButtonCant = ({
  cantidad, handleChangeCant, producto,
}) => {
  const [cant, setCant] = useState(cantidad);

  const incCant = () => (
    producto.stock <= cant ? warningAlert("El stock máximo del accesorio es " + cant) : cant < 100
      ? (setCant(cant + 1), handleChangeCant(producto.id, cant + 1))
      : setCant(100)
  );

  const decCant = () => (
    cant > 1
      ? (setCant(cant - 1), handleChangeCant(producto.id, cant - 1))
      : setCant(1)
  );

  return (
    <div className="flex justify-center">
      <button type="button" onClick={decCant} className="flex items-center justify-center h-7 w-7 hover:bg-blue-400 ring-1 ring-blue-400 text-blue-400 hover:text-white rounded-full focus:outline-none">
        <IconMinus />
      </button>
      <input
        type="text"
        className="h-7 w-7 text-center focus:outline-none mx-0.5"
        value={cant}
        readOnly
      />
      <button type="button" onClick={incCant} className="flex items-center justify-center h-7 w-7 hover:bg-blue-400 ring-1 ring-blue-400 text-blue-400 hover:text-white rounded-full focus:outline-none">
        <IconPlus />
      </button>
    </div>
  );
};

ButtonCant.propTypes = {
  cantidad: PropTypes.number.isRequired,
  handleChangeCant: PropTypes.func.isRequired,
  idProduct: PropTypes.number.isRequired,
};

export default ButtonCant;
