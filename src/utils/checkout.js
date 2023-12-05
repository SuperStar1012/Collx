
export const getChargeBreakdownValue = (chargeBreakdown, priceType) => {
  const price = chargeBreakdown.find(item => item.type === priceType);
  return price?.value;
};
