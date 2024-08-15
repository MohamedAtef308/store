import { fetchUserFavorites } from "@/utils/actions";
import SectionTitle from "@/components/global/SectionTitle";
import ProductsGrid from "@/components/products/ProductsGrid";

async function FavoritesPage() {
  const favorites = await fetchUserFavorites();

  if (favorites.length === 0) {
    return <SectionTitle title="You have no favorites yet." />;
  }

  return (
    <div>
      <SectionTitle title="Favorites" />
      <ProductsGrid products={favorites.map((favorite) => favorite.product)} />
    </div>
  );
}

export default FavoritesPage;
