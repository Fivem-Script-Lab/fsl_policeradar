import { IsRunningInBrowser } from "../tools/misc";


export async function TriggerNuiCallback<T = unknown>(callback: string, data?: unknown, mockData?: T): Promise<T> {
    if (IsRunningInBrowser() && mockData) return mockData;
    const options = {method: 'post', headers: {'Content-Type': 'application/json; charset=UTF-8'}, body: JSON.stringify(data)};
    const resource = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'nui-frame-app';
    const response = (await fetch(`https://${resource}/${callback}`, options)).json();
    return response;
  };
