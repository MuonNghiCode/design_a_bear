import { notFound } from "next/navigation";
import { ALL_PRODUCTS } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetailClient from "@/components/product-detail/ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = ALL_PRODUCTS.find((p) => p.id === id);

  if (!product) notFound();

  const related = ALL_PRODUCTS.filter(
    (p) => p.id !== id && p.category === product.category,
  ).slice(0, 4);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F4F7FF" }}>
      <Header />
      <div className="pt-25">
        <ProductDetailClient product={product} related={related} />
      </div>
      <Footer />
    </main>
  );
}
