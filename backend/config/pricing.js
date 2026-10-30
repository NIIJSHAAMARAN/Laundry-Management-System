// Prices in INR per piece. Edit to match your shop.
module.exports = {
  prices: {
    shirt:   { wash: 20, 'dry-clean': 80, iron: 10, fold: 5 },
    trouser: { wash: 25, 'dry-clean': 90, iron: 12, fold: 5 },
    bedsheet:{ wash: 60, 'dry-clean': 150, iron: 25, fold: 10 },
    saree:   { wash: 50, 'dry-clean': 200, iron: 40, fold: 10 },
    other:   { wash: 30, 'dry-clean': 100, iron: 15, fold: 5 }
  },
  addOns: { 'stain-removal': 30 },
  expressMultiplier: 1.5,
  deliveryFee: 50
};
