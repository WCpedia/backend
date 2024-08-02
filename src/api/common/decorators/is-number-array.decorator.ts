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
          if (!Array.isArray(value)) {
            value = [value];
          }
          return value.every((item) => !isNaN(Number(item)));
        },
        defaultMessage: () => 'must be an array of numbers',
      },
    });

    Transform(({ value }) =>
      Array.isArray(value) ? value.map(Number) : [Number(value)],
    )(object, propertyName);
  };
}
