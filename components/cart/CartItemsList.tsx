"use client"
import { Card } from "../ui/card"
import { FirstColumn, SecondColumn, FourthColumn } from "./CartItemColumns"
import ThirdColumn from "./ThirdColumn"
import { type CartItemWithProduct } from "@/utils/types"

function CartItemsList({cartItems}: {cartItems: CartItemWithProduct[]}) {
  return (
    <div>
      {cartItems.map((cartItem) => (
        <Card key={cartItem.id} className="flex flex-col gap-y-4 md:flex-row flex-wrap p-6 mb-8 gap-x-4">
          <FirstColumn image={cartItem.product.image} name={cartItem.product.name}/>
          <SecondColumn productId={cartItem.productId} name={cartItem.product.name} company={cartItem.product.company}/>
          <ThirdColumn id={cartItem.id} quantity={cartItem.amount}/>
          <FourthColumn price={cartItem.product.price}/>
        </Card>
      ))}
    </div>
  );
}

export default CartItemsList