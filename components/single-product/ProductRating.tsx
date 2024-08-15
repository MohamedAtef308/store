import { fetchProductRating } from "@/utils/actions";
import { FaStar } from "react-icons/fa"

type ProductRatingProps = {
    productId: string
}

async function ProductRating({productId}: ProductRatingProps) {
  const {avgRating, countRating} = await fetchProductRating(productId);
  
    return <span className="flex gap-1 items-center text-md mt-1 mb-4">
        <FaStar className="w-3 h-3"/>
        {avgRating} {`(${countRating}) reviews`}
    </span>;
}

export default ProductRating