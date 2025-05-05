// global.d.ts
import { Buffer } from 'buffer';

declare global {
  interface Buffer extends Uint8Array {
    prototype: Uint8Array;
  }
}