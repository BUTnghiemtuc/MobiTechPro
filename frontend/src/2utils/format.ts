/**
 * Formats a number or string as Vietnamese Dong (VND).
 * e.g., 1000000 -> 1.000.000 ₫
 */
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return '0 ₫';
  }

  // Use toLocaleString for Vietnamese formatting (e.g., 1.000.000)
  return numericPrice.toLocaleString('vi-VN') + ' ₫';
};
