import { isDate } from './isDate';

export const unmarshallDates = (property: any): any => {
  if (property === undefined || property === null) {
    return property;
  }

  if (Array.isArray(property)) {
    return property.map(unmarshallDates);
  }

  if (typeof property === 'object') {
    return Object.entries(property).reduce(
      (newProperty, [key, value]) => ({
        ...newProperty,
        [key]: unmarshallDates(value),
      }),
      {},
    );
  }

  if (!!property && typeof property === 'string' && isDate(property)) {
    return new Date(property);
  }

  return property;
};
