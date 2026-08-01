export function hasDiscount(discountPercentage) {
    return Boolean(discountPercentage) && discountPercentage > 0;
}

export function getDiscountedPrice(price, discountPercentage) {
    if (!hasDiscount(discountPercentage)) return Number(price);
    const discounted = Number(price) * (1 - discountPercentage / 100);
    return Math.round(discounted * 100) / 100;
}

export function formatPrice(price) {
    const num = Number(price);
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}
