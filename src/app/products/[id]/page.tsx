import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetailClient from "@/components/product-detail/ProductDetailClient";
import { productService } from "@/services/product.service";
import { ProductItem } from "@/types/products";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  
  try {
    // Determine if id is a slug or uuid
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    const response = isUuid 
      ? await productService.getProductById(id)
      : await productService.getProductBySlug(id);

    if (response.isFailure || !response.value) {
      notFound();
    }

    const product = response.value;

    // Fetch related products (optional)
    let related: ProductItem[] = [];
    try {
      const allRes = await productService.getProducts({ pageSize: 4 });
      if (!allRes.isFailure && allRes.value?.items) {
        related = allRes.value.items
          .filter((p) => p.productId !== product.productId)
          .slice(0, 4)
          .map(p => ({
             id: p.productId,
             name: p.name,
             description: p.name,
             price: p.price,
             image: p.imageUrl || "/teddy_bear.png",
             category: p.productType === "ACCESSORY" ? "accessory" : p.productType === "BASE_BEAR" ? "bear" : "complete",
             badgeColor: "#17409A",
             slug: p.slug
          } as ProductItem));
      }
    } catch (e) {
      console.error("Failed to fetch related products", e);
    }

    return (
      <main className="min-h-screen" style={{ backgroundColor: "#F4F7FF" }}>
        <Header />
        <div className="pt-25">
          <ProductDetailClient product={product} related={related} />
        </div>
        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    notFound();
  }
}

