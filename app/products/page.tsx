import ProductsContainer from "@/components/products/ProductsContainer";

type ProductsPageProps = {
  searchParams: {
    layout?: string;
    search?: string;
  };
};

async function ProductsPage({ searchParams }: ProductsPageProps) {
  const layout = searchParams.layout || "grid";
  const search = searchParams.search || ""
  
  return <ProductsContainer layout={layout} search={search}/>
}

export default ProductsPage;
