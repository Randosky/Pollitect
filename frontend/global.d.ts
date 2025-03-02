export {};

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  interface Window {}
}
