import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

type TextAreaInputProps = {
    name: string;
    labelText?: string;
    defaultValue?: string;
}

function TextAreaInput({name, labelText, defaultValue}: TextAreaInputProps) {
  return (
    <div className="mb-2">
        <Label htmlFor={name} className="capitalize">{labelText || name}</Label>
        <Textarea name={name} id={name} rows={5} defaultValue={defaultValue} className="leading-loose" required/>
    </div>
  )
}

export default TextAreaInput