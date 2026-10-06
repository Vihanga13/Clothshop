/**
 * Currency formatting utility for Sri Lankan Rupees (LKR)
 */
export const formatPrice = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'LKR 0';
  }
  return `LKR ${Math.round(amount).toLocaleString('en-US')}`;
};

export const formatLKR = formatPrice;
