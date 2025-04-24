declare module '@novnc/novnc/core/rfb' {
  export default class RFB {
    constructor(
      target: HTMLElement,
      url: string,
      options?: {
        credentials?: {
          password?: string;
        };
        shared?: boolean;
        repeaterID?: string;
        wsProtocols?: string[];
      }
    );

    disconnect(): void;
    connect(): void;
    addEventListener(event: string, callback: () => void): void;
    removeEventListener(event: string, callback: () => void): void;
  }
}