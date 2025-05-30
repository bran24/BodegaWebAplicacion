/* eslint linebreak-style: ["error", "windows"] */
import PropTypes from 'prop-types';

const ButtonIcon = ({
  icon, onClick, padding, colorText, isCircle,
  isBgHover, colorBgHover,
  isGroupHover, isColorHover, colorHover,
  isBorder, colorBorder,
  isBgColor, colorBg,
}) => (
  <button
    type="button"
    className={`flex items-center justify-center p-${padding} text-${colorText} 
    ${isCircle ? 'rounded-full' : 'rounded-md'}
    ${isBgHover ? `hover:bg-${colorBgHover} hover:text-white` : ''}
    ${isGroupHover ? `group-hover:text-${colorHover}` : ''}
    ${isColorHover ? `hover:text-${colorHover}` : ''} 
    ${isBorder ? `border ${colorBorder !== '' ? `border-${colorBorder}` : 'border-gray-300'} hover:border-${colorBgHover || colorBg}` : ''} 
    ${isBgColor ? `${colorBg !== '' ? `bg-${colorBg}` : ''}` : ''} 
    focus:outline-none`}
    onClick={onClick}
  >
    {icon}
  </button>
);

ButtonIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  padding: PropTypes.number,
  colorText: PropTypes.string,
  isCircle: PropTypes.bool,
  isBgHover: PropTypes.bool,
  colorBgHover: PropTypes.string,
  isGroupHover: PropTypes.bool,
  isColorHover: PropTypes.bool,
  colorHover: PropTypes.string,
  isBorder: PropTypes.bool,
  colorBorder: PropTypes.string,
  isBgColor: PropTypes.bool,
  colorBg: PropTypes.string,
};

ButtonIcon.defaultProps = {
  padding: 2,
  isCircle: false,
  colorText: 'white',
  isBgHover: false,
  colorBgHover: '',
  isGroupHover: false,
  isColorHover: false,
  colorHover: '',
  isBorder: false,
  colorBorder: '',
  isBgColor: false,
  colorBg: '',
};

export default ButtonIcon;
