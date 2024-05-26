import { Transform } from 'class-transformer';

export function ToBoolean() {
  return function (target: any, key: string) {
    Transform(({ obj }) => valueToBoolean(obj[key]), { toClassOnly: true })(
      target,
      key,
    );
  };
}

function valueToBoolean(value: any) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }

  const trueValues = ['true', '1'];
  const falseValues = ['false', '0'];

  const valueLower = value.toLowerCase();
  if (trueValues.includes(valueLower)) {
    return true;
  }
  if (falseValues.includes(valueLower)) {
    return false;
  }

  throw new Error('Invalid boolean value');
}
