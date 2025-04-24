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
    onCredentialsRequired?: (event) => void;
    onSecurityFailure?: (event) => void;
    qualityLevel?: number;
    compressionLevel?: number;
    showStatus?: boolean;
    ref?: Ref<any>;
    rfbOptions?: {
      credentials?: {
        password: string;
      };
    };
  }

  export const VncScreen: FC<VncScreenProps>;
}