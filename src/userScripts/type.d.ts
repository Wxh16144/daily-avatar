import * as $ from 'jquery/dist/jquery.slim';

declare global {
  // 油猴脚本的GM_* API 声明
  var GM_getValue: <T>(key: string, defaultValue?: T) => T;
  var GM_setValue: (key: string, value: any) => void;
  var GM_deleteValue: (key: string) => void;
  var GM_listValues: () => string[];
  var GM_notification: (details: { text: string; title?: string; image?: string; highlight?: boolean; silent?: boolean; timeout?: number; onclick?: () => void; ondone?: () => void; }) => void;
  var GM_xmlhttpRequest: (details: {
    method?: "GET" | "HEAD" | "POST";
    url: string;
    headers?: { [key: string]: string };
    data?: string | FormData | Blob;
    cookie?: string;
    binary?: boolean;
    nocache?: boolean;
    revalidate?: boolean;
    timeout?: number;
    context?: any;
    responseType?: "arraybuffer" | "blob" | "json" | "text";
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    onload?: (response: any) => void;
    onloadstart?: (response: any) => void;
    onprogress?: (response: any) => void;
    onreadystatechange?: (response: any) => void;
    ontimeout?: (response: any) => void;
    onabort?: (response: any) => void;
    onerror?: (response: any) => void;
  }) => { abort: () => void };
  var GM_registerMenuCommand: (name: string, cmd: () => void, accessKey?: string) => string;
  var GM_unregisterMenuCommand: (id: string) => void;

  // 用于 jQuery
  interface Window {
    $: typeof $;
  }
}

export { };