declare module 'react-vnc' {
  import { FC, Ref } from 'react';

  interface VncScreenProps {
    url: string;
    scaleViewport?: boolean;
    background?: string;
    style?: React.CSSProperties;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
    qualityLevel?: number;
    compressionLevel?: number;
    showStatus?: boolean;
    ref?: Ref<any>;
  }

  export const VncScreen: FC<VncScreenProps>;
}