declare const postRequest: (url: string, data?: any) => Promise<Response>;
declare const getServerToken: (serverTokenUrl: string) => Promise<string>;
export { postRequest, getServerToken };
