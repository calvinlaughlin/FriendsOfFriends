declare module 'twrnc' {
    const create: (config: any) => (classNames: string) => { [key: string]: any };
    export { create };
  }