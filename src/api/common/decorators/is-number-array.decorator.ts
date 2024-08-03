import { Transform } from 'class-transformer';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNumberArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value === 'string') {
            value = value.split(',').map((item) => item.trim());
          } else if (!Array.isArray(value)) {
            value = [value];
          }
          return value.every((item) => !isNaN(Number(item)));
        },
        defaultMessage: () => 'must be an array of numbers',
      },
    });

    Transform(({ value }) => {
      if (typeof value === 'string') {
        return value.split(',').map((item) => Number(item.trim()));
      }
      return Array.isArray(value) ? value.map(Number) : [Number(value)];
    })(object, propertyName);
  };
}
