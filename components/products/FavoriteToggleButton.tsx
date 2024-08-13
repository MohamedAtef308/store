import { Button } from "../ui/button";
import {FaHeart} from "react-icons/fa"

type FavoriteToggleButtonProps = {
    productId: string
}

function FavoriteToggleButton({ productId }: FavoriteToggleButtonProps) {
  return (
    <Button size="icon" variant="outline" className="p-2 cursor-pointer">
      <FaHeart />
    </Button>
  );
}

export default FavoriteToggleButton