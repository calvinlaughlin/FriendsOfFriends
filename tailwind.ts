import { create } from 'twrnc';

// Create the tailwind instance
const tw = create(require('./tailwind.config.js'));

// Export a function that wraps tw to handle both string and TemplateStringsArray inputs
export const tailwind = (strings: TemplateStringsArray | string, ...values: any[]) => {
  if (typeof strings === 'string') {
    return tw(strings);
  }
  return tw(strings, ...values);
};

// Export the original tw function for cases where you need direct access
export { tw };