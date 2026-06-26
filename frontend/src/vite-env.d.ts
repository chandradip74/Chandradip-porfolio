/// <reference types="vite/client" />

// Declare static asset types so TypeScript is happy with imports
declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
