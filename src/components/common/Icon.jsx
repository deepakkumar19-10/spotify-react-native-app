import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';

export default function Icon({
  name,
  size = 22,
  color = colors.textPrimary,
  style,
}) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
}
