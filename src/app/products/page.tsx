import ProductsClient from "@/components/products/ProductsClient";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  return <ProductsClient initialCategory={category} />;
}
