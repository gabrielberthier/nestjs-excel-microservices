export function featureToCamelCase(feature: string) {
  return feature
    .toLowerCase()
    .replace(/:/g, '_')
    .split('_')
    .map((word, index) =>
      index === 0 ? word : word[0].toUpperCase() + word.slice(1),
    )
    .join('');
}

export const objToString = (el: unknown): string => {
  if (typeof el === 'string') {
    return el;
  } else if (typeof el === 'object' && el !== null) {
    return JSON.stringify(el);
  }
  return String(el);
};
