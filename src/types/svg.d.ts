declare module '*.svg' {
  import * as React from 'react';

  // For SVGs used as React components
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  // For SVGs used as file paths/URLs
  const src: string;
  export default src;
}
