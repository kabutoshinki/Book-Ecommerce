import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import validator from 'validator';

export function IsUuidArray(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    let fakeElements = [];
    registerDecorator({
      name: 'IsUuidArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        defaultMessage(): string {
          return `[${fakeElements}] is not uuid`;
        },
        validate(value: string[], args: ValidationArguments) {
          fakeElements = [];
          let isOnlyUuid = true;
          value.forEach((element) => {
            const result = validator.isUUID(element);
            if (!result) {
              isOnlyUuid = result;
              fakeElements.push(element);
            }
          });
          return isOnlyUuid;
        },
      },
    });
  };
}
