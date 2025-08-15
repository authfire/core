import { getAppCheckToken } from "./const";

const postRequest = async (url: string, data: any = {}): Promise<Response> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Firebase-AppCheck": await getAppCheckToken()
  };

  return await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    credentials: 'include',
  });
};

const getServerToken = async (serverTokenUrl: string): Promise<string> => {
  const response = await postRequest(serverTokenUrl);

  if (!response.ok) {
    throw new Error("Failed to get server token: " + response.statusText);
  }

  const token = await response.json();
  if (!token.value) {
    throw new Error("No token received");
  }

  return token.value;

}

export { postRequest, getServerToken }
