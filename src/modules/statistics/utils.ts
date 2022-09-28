export const convertPercentLabel = (number: number, precision = 2) => {
  if (Math.floor(number) === number)
    return `${number}%`;

  return `${number.toFixed(precision)}%`;
};
