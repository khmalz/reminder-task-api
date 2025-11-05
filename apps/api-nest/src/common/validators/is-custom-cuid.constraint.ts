import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsCuid', async: false })
export class IsCuidConstraint implements ValidatorConstraintInterface {
   validate(value: any) {
      if (typeof value !== 'string') {
         return false;
      }

      if (!value.startsWith('c')) {
         return false;
      }

      if (value.length < 7) {
         return false;
      }

      return true;
   }

   defaultMessage() {
      return `($value) is not a valid ID. Must be a string, start with 'c', and be at least 7 chars long.`;
   }
}

export function IsCuid(validationOptions?: ValidationOptions) {
   return function (object: object, propertyName: string) {
      registerDecorator({
         name: 'isCuid',
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         validator: IsCuidConstraint,
      });
   };
}
