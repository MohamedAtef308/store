import { Button } from "../ui/button"

type AddToCartProps = {
    productId: string
}

function AddToCart({productId}: AddToCartProps) {
  return (
    <Button size="lg" className="capitalize mt-8">add to cart</Button>
  )
}

export default AddToCart