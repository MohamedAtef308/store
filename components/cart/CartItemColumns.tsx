import { formatCurrency } from "@/utils/formats";
import Image from "next/image";
import Link from "next/link";

type FirstColumnProps = {
  name: string;
  image: string;
};

export function FirstColumn({ name, image }: FirstColumnProps) {
  return (
    <div className="relative h-24 w-24 sm:h-32 sm:w-32">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
        priority
        className="w-full rounded-md object-cover"
      />
    </div>
  );
}

type SecondColumnProps = {
  name: string;
  company: string;
  productId: string;
};

export function SecondColumn({ name, company, productId }: SecondColumnProps) {
  return (
    <div className="sm:w-48">
      <Link href={`/products/${productId}`}>
        <h3 className="capitalize font-medium hover:underline">{name}</h3>
      </Link>
      <h4 className="mt-2 capitalize text-xs">{company}</h4>
    </div>
  );
}

type FourthColumnProps = {
  price: number;
};

export function FourthColumn({ price }: FourthColumnProps) {
  return <p className="font-medium md:ml-auto">{formatCurrency(price)}</p>;
}
