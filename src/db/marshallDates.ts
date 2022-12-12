export const marshallDates = (property: any): any => {
  if (property === undefined || property === null) {
    return property;
  }

  if (typeof property.toISOString === 'function') {
    return property.toISOString();
  }

  if (Array.isArray(property)) {
    return property.map(marshallDates);
  }

  if (typeof property === 'object') {
    return Object.entries(property).reduce(
      (newProperty, [key, value]) => ({
        ...newProperty,
        [key]: marshallDates(value),
      }),
      {},
    );
  }

  return property;
};
