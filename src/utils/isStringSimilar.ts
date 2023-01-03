export const isStringSimilar = (a: string, b: string): number => {
  let longer = a;
  let shorter = b;

  if (a.length < b.length) {
    longer = b;
    shorter = a;
  }

  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }

  return (longerLength - editDistance(longer, shorter)) / longerLength;
};

const editDistance = (a: string, b: string) => {
  const longer = a.toLowerCase();
  const shorter = b.toLowerCase();

  const costs = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;

    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
        continue;
      }

      if (j <= 0) {
        continue;
      }

      let newValue = costs[j - 1];
      if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
      }

      costs[j - 1] = lastValue;
      lastValue = newValue;
    }

    if (i > 0) {
      costs[shorter.length] = lastValue;
    }
  }

  return costs[shorter.length];
};
