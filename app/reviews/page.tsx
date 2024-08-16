import { deleteReviewAction, fetchProductReviewsByUser } from "@/utils/actions";
import ReviewCard from "@/components/reviews/ReviewCard";
import SectionTitle from "@/components/global/SectionTitle";
import FormContainer from "@/components/form/FormContainer";
import { IconButton } from "@/components/form/Buttons";

async function ReviewsPage() {
  const reviews = await fetchProductReviewsByUser();

  if (reviews.length === 0) {
    return <SectionTitle title="You have no reviews yet" />;
  }

  return (
    <>
      <SectionTitle title="Your Reviews" />
      <section className='grid md:grid-cols-2 gap-8 mt-4'>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            reviewInfo={{
              comment: review.comment,
              rating: review.rating,
              name: review.product.name,
              image: review.product.image,
            }}
          >
            <DeleteReview reviewId={review.id} />
          </ReviewCard>
        ))}
      </section>
    </>
  );
}

function DeleteReview({ reviewId }: { reviewId: string }) {
  const deleteReview = deleteReviewAction.bind(null, { reviewId });

  return (
    <FormContainer action={deleteReview}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
}

export default ReviewsPage;
