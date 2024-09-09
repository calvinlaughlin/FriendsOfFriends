declare module 'twrnc' {
  export function create(config: any): {
    (strings: TemplateStringsArray | string, ...values: any[]): any;
    style: (strings: TemplateStringsArray | string, ...values: any[]) => any;
    color: (color: string) => string;
  };
}