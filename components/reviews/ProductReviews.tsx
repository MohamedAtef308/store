import { fetchProductReviews } from "@/utils/actions";
import ReviewCard from "./ReviewCard";
import SectionTitle from "../global/SectionTitle";

type ProductReviewsProps = {
  productId: string;
};

async function ProductReviews({ productId }: ProductReviewsProps) {
  const reviews = await fetchProductReviews(productId);
  return (
    <div className="mt-16">
      <SectionTitle title="product reviews" />

      <div className="grid md:grid-cols-2 gap-8 my-8">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            reviewInfo={{
              comment: review.comment,
              rating: review.rating,
              image: review.authorImageUrl,
              name: review.authorName,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;
