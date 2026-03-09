import { InventoryReview, InventoryReviewSummary } from "@/types/reviews";

const toSafeRating = (value: number | undefined) => {
  const numericValue = Number(value ?? 0);

  if (Number.isNaN(numericValue)) return 0;
  if (numericValue < 0) return 0;
  if (numericValue > 5) return 5;

  return Number(numericValue.toFixed(1));
};

export const emptyInventoryReviewSummary: InventoryReviewSummary = {
  averageScore: 0,
  productQuality: 0,
  supplierQuality: 0,
  deliveryQuality: 0,
  totalReviews: 0,
};

export const buildInventoryReviewSummary = (
  reviews: InventoryReview[] = []
): InventoryReviewSummary => {
  if (!reviews.length) {
    return emptyInventoryReviewSummary;
  }

  const aggregate = reviews.reduce(
    (accumulator, review) => {
      accumulator.averageScore += Number(review.averageScore ?? 0);
      accumulator.productQuality += Number(review.productQuality ?? 0);
      accumulator.supplierQuality += Number(review.supplierQuality ?? 0);
      accumulator.deliveryQuality += Number(review.deliveryQuality ?? 0);

      return accumulator;
    },
    {
      averageScore: 0,
      productQuality: 0,
      supplierQuality: 0,
      deliveryQuality: 0,
    }
  );

  const divisor = reviews.length;

  return {
    averageScore: toSafeRating(aggregate.averageScore / divisor),
    productQuality: toSafeRating(aggregate.productQuality / divisor),
    supplierQuality: toSafeRating(aggregate.supplierQuality / divisor),
    deliveryQuality: toSafeRating(aggregate.deliveryQuality / divisor),
    totalReviews: reviews.length,
  };
};
