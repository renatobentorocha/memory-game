import { Dimensions } from 'react-native';

const { width, height, fontScale, scale } = Dimensions.get('window');

export const DEVICE_DIMENSIONS = { width, height, fontScale, scale };
export const ORIGIN_DIMENSIONS = { height: 896, width: 414 };
