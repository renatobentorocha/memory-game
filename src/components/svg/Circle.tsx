import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function Circle(props: SvgProps) {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <Path
        d="M30 20c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10z"
        fill="transparent"
        stroke="#000"
        strokeWidth={20}
        strokeDasharray={2 * Math.PI * 10}
        strokeDashoffset={10}
      />
    </Svg>
  );
}

export default Circle;
