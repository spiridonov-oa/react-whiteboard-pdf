export const throttle = (
  func: (...args: any[]) => void,
  limit: number,
): ((...args: any[]) => void) => {
  let lastFunc: NodeJS.Timeout | null;
  let lastRan: number | null = null;

  return function (...args: any[]) {
    const context = this;

    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(() => {
        if (Date.now() - (lastRan as number) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - (lastRan as number)));
    }
  };
};

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value);
};
export const isString = (value: any): value is string => {
  return typeof value === 'string';
};
