import { Buffer } from 'buffer';

// @ts-expect-error - support third-party libraries requiring process.env.NODE_ENV
globalThis.process = {
  env: {
    NODE_ENV: import.meta.env.MODE,
  },
};

globalThis.Buffer = Buffer;

export const formatContractAddress = (address: string): string => {
  let cleaned = address.trim();
  if (cleaned.startsWith('0x') || cleaned.startsWith('0X')) {
    cleaned = cleaned.slice(2);
  }
  if (cleaned.length > 64) {
    cleaned = cleaned.slice(0, 64);
  }
  return cleaned;
};
