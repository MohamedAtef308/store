import { type Products } from "@prisma/client";
import { formatCurrency } from "@/utils/formats";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import FavoriteToggleButton from "./FavoriteToggleButton";

function ProductsGrid({products}: {products: Products[]}) {
  return <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {
        products.map(product => (
            <article key={product.id} className="group relative">
                <Link href={`/products/${product.id}`}>
                    <Card className="transform group-hover:shadow-xl transition-shadow duration-500">
                        <CardContent className="p-4">
                            <div className="relative h-64 md:h-48 rounded overflow-hidden">
                                <Image src={product.image} alt={product.name} fill sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw" priority className="rounded w-full object-cover transform group-hover:scale-110 transition-transform duration-500"/>
                            </div>
                            <div className="mt-4 text-center">
                                <h2 className="text-lg capitalize">{product.name}</h2>
                                <p className="text-muted-foreground mt-2">{formatCurrency(product.price)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <div className="absolute top-7 right-7 z-5">
                    <FavoriteToggleButton productId={product.id}/>
                </div>
            </article>
        ))
    }
  </div>;
}

export default ProductsGrid;
