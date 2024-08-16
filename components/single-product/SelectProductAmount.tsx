import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../ui/select";
import { Mode } from "@/utils/types";

type SelectProductAmountProps = {
    mode: Mode.SingleProduct;
    amount: number;
    setAmount: (value:number) => void;
}

type SelectProductItemAmountProps = {
    mode: Mode.CartItem;
    amount: number;
    setAmount: (value:number) => Promise<void>
    isLoading: boolean;
};



function SelectProductAmount(props: SelectProductAmountProps | SelectProductItemAmountProps) {
  const {mode, amount, setAmount} = props
  const cartItem = mode === Mode.CartItem
  const values = Array.from({length: cartItem? amount+10:10}, (_,index) => ((index+1).toString()))

    return (
    <>
    <Select defaultValue={amount.toString()}
    onValueChange={(value) => {setAmount(Number(value))}}
    disabled={cartItem? props.isLoading: false}
    >
        <SelectTrigger className={cartItem? "w-[100px]": "w-[150px]"}>
            <SelectValue placeholder={amount}/>
        </SelectTrigger>
        <SelectContent>
            {
                values.map((value,index) => (
                    <SelectItem key={index} value={value}>
                        {value}
                    </SelectItem>
                ))
            }
        </SelectContent>
    </Select>
    </>
  )
}

export default SelectProductAmount