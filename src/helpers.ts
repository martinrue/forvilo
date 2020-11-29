export const $ = <T>(selector: string) => document.querySelector(selector) as T | null;

export const onReady = (fn: any) => {
  document.addEventListener("DOMContentLoaded", fn);
};
