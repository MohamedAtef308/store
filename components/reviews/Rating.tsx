import { FaStar, FaRegStar } from "react-icons/fa"

type RatingProps = {
    rating: number
}

function Rating( {rating}: RatingProps) {
  const stars = Array.from({length: 5}, (_,index) => index+1 <= rating)
  
    return (
      <div className="flex items-center gap-x-1">
        {stars.map((isFilled, i) =>
          isFilled ? (
            <FaStar className="w-3 h-3 text-primary" key={i} />
          ) : (
            <FaRegStar className="w-3 h-3 text-gray-400" key={i} />
          )
        )}
      </div>
    );
}

export default Rating