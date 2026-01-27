/**
 * Common test setup utilities
 */

export const mockLocalStorage = () => {
  const store: Record<any, any> = {};

  return {
    getItem: (key: any) => store[key] || null,
    setItem: (key: any, value: any) => {
      store[key] = value.toString();
    },
    removeItem: (key: any) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };
};

export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
