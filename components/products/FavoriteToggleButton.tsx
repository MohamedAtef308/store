import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "../form/Buttons";
import { fetchFavoriteId } from "@/utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";

type FavoriteToggleButtonProps = {
    productId: string
}

async function FavoriteToggleButton({ productId }: FavoriteToggleButtonProps) {
  const {userId} = auth();
  if (!userId) {return <CardSignInButton/>}

  const favoriteId = await fetchFavoriteId(productId);

  return <FavoriteToggleForm productId={productId} favoriteId={favoriteId}/>
}

export default FavoriteToggleButton