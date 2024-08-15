import BreadCrumbs from "@/components/single-product/BreadCrumbs";
import { fetchSingleProduct } from "@/utils/actions";
import Image from "next/image";
import { formatCurrency } from "@/utils/formats";
import FavoriteToggleButton from "@/components/products/FavoriteToggleButton";
import AddToCart from "@/components/single-product/AddToCart";
import ProductRating from "@/components/single-product/ProductRating";
import ShareButton from "@/components/single-product/ShareButton";
import SubmitReview from "@/components/reviews/SubmitReview";
import ProductReviews from "@/components/reviews/ProductReviews";

type SingleProductPageProps = {
  params: {
    id: string;
  };
};

async function SingleProductPage({ params }: SingleProductPageProps) {
  const product = await fetchSingleProduct(params.id);
  return (
    <section>
      <BreadCrumbs name={product.name} />
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        <div className="relative h-96 lg:h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            priority
            className="w-full rounded-md object-cover"
          />
        </div>

        <div>
          <div className="flex gap-x-8 items-center">
            <h1 className="capitalize text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-x-2">
              <FavoriteToggleButton productId={params.id} />
              <ShareButton name={product.name} productId={params.id} />
            </div>
          </div>
          <ProductRating productId={params.id} />
          <h4 className="text-xl mt-2">{product.company}</h4>
          <p className="mt-3 text-md bg-muted inline-block p-2 rounded-md">
            {formatCurrency(product.price)}
          </p>
          <p className="mt-6 leading-8 text-muted-foreground">
            {product.description}
          </p>
          <AddToCart productId={params.id} />
        </div>

        <ProductReviews productId={params.id} />
        <SubmitReview productId={params.id} />
      </div>
    </section>
  );
}

export default SingleProductPage;
