/**
 * Formats a number to Pakistani Rupee currency format (e.g. Rs. 24,500)
 */
export const formatPKR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rs. 0';
  }
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};

/**
 * Calculates discount percentage
 */
export const calculateDiscount = (original, sale) => {
  if (!original || !sale || original <= sale) return 0;
  return Math.round(((original - sale) / original) * 100);
};
