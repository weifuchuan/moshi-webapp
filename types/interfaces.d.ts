declare var __DEV__: boolean;

declare var ready: boolean;
declare var windowReady: boolean;
declare var pending: Function[];

declare function send(payload: any): Promise<any>

declare var ReactNativeWebView: {
  postMessage: (data: string) => void;
};

declare var handler: {
  async handle(...args: any[]): Promise<any>;
};