import {
  fetchAdminProductDetails,
  updateProductAction,
  updateProductImageAction,
} from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import { SubmitButton } from "@/components/form/Buttons";
import CheckBoxInput from "@/components/form/CheckBoxInput";
import ImageInputContainer from "@/components/form/ImageInputContainer";

type EditProductPageProps = {
  params: {
    id: string;
  };
};

async function EditProductPage({ params }: EditProductPageProps) {
  const product = await fetchAdminProductDetails(params.id);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">update product</h1>
      <div className="border p-8 rounded-md">
        <ImageInputContainer
          action={updateProductImageAction}
          name={product.name}
          image={product.image}
          text="update image"
        >
          <input type="hidden" name="id" value={params.id} />
          <input type="hidden" name="url" value={product.image} />
        </ImageInputContainer>
        <FormContainer action={updateProductAction}>
          <div className="grid gap-4 md:grid-cols-2 my-4">
            <input type="hidden" name="id" value={params.id} />
            <FormInput
              type="text"
              name="name"
              label="product name"
              defaultValue={product.name}
            />
            <FormInput
              type="text"
              name="company"
              label="company"
              defaultValue={product.company}
            />
            <PriceInput defaultValue={product.price} />
          </div>
          <TextAreaInput
            name="description"
            labelText="product description"
            defaultValue={product.description}
          />
          <div className="mt-6">
            <CheckBoxInput
              name="featured"
              label="featured"
              defaultChecked={product.featured}
            />
          </div>
          <SubmitButton text="update product" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}

export default EditProductPage;
