import { FaStar } from "react-icons/fa"

type ProductRatingProps = {
    productId: string
}

async function ProductRating({productId}: ProductRatingProps) {
  const rating = 4.2;
  const count = 25;
  
    return <span className="flex gap-1 items-center text-md mt-1 mb-4">
        <FaStar className="w-3 h-3"/>
        {rating} {`(${count}) reviews`}
    </span>;
}

export default ProductRating