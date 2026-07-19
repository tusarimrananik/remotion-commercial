import React from 'react';
import {Composition} from 'remotion';
import {Commercial, commercialSchema, defaultCommercialProps} from './Commercial';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BangladeshHackersAdSquare"
        component={Commercial}
        durationInFrames={1130}
        fps={30}
        width={1080}
        height={1080}
        schema={commercialSchema}
        defaultProps={defaultCommercialProps}
      />
      <Composition
        id="BangladeshHackersAdVertical"
        component={Commercial}
        durationInFrames={1130}
        fps={30}
        width={1080}
        height={1920}
        schema={commercialSchema}
        defaultProps={defaultCommercialProps}
      />
    </>
  );
};
