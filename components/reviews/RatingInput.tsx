import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type RatingInputProps = {
  name: string;
  labelText?: string;
};

function RatingInput({ name, labelText }: RatingInputProps) {
  const ratings = Array.from({ length: 5 }, (_, index) =>
    (index + 1).toString()
  ).reverse();

  return (
    <div className="mb-2 max-w-xs">
      <Label htmlFor={name} className="capitalize">
        {labelText || name}
      </Label>
      <Select defaultValue={ratings[0]} name={name} required>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ratings.map((rating) => (
            <SelectItem key={rating} value={rating}>
              {rating}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default RatingInput;
