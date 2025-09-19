// src/model-viewer.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        ar?: boolean|boolean;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'shadow-intensity'?: string | number;
        'environment-image'?: string;
        exposure?: string | number;
        [key: string]: any; // Allow additional attributes
      },
      HTMLElement
    >;
  }
}