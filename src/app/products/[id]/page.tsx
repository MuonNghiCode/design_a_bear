import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetailClient from "@/components/product-detail/ProductDetailClient";
import { productService } from "@/services/product.service";
import { ProductItem } from "@/types/products";
import { type PersonalizationRule } from "@/types/responses";
import {
  DEFAULT_OG_IMAGE,
  PUBLIC_ROBOTS,
  SITE_NAME,
  SITE_URL,
} from "@/constants/seo";

interface Props {
  params: Promise<{ id: string }>;
}

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const getProductByParam = cache(async (id: string) => {
  const response = isUuid(id)
    ? await productService.getProductById(id)
    : await productService.getProductBySlug(id);

  if (response.isFailure || !response.value) {
    return null;
  }

  return response.value;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByParam(id);

  if (!product) {
    return {
      title: "San pham khong ton tai",
      description: "Khong tim thay san pham ban dang tim.",
      robots: PUBLIC_ROBOTS,
      alternates: { canonical: "/products" },
    };
  }

  const productPath = `/products/${product.slug || id}`;
  const imageUrl = product.media?.[0]?.url || product.variants?.[0]?.imageUrl || DEFAULT_OG_IMAGE;
  const pageTitle = `${product.name} - ${SITE_NAME}`;
  const pageDescription =
    product.description?.slice(0, 155) ||
    `San pham ${product.name} tai ${SITE_NAME}.`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: productPath,
    },
    robots: PUBLIC_ROBOTS,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: productPath,
      images: [imageUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  
  try {
    const product = await getProductByParam(id);

    if (!product) {
      notFound();
    }

    // Fetch personalization rules concurrently if possible (or wait if we need productId)
    let rules: PersonalizationRule[] = [];
    try {
      if (product.productId) {
        const rulesResponse = await productService.getPersonalizationRules(product.productId);
        if (!rulesResponse.isFailure && rulesResponse.value) {
          rules = rulesResponse.value;
        }
      }
    } catch (e) {
      console.error("Failed to fetch personalization rules:", e);
    }

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

    const productPath = `/products/${product.slug || id}`;
    const productImage =
      product.media?.[0]?.url ||
      product.variants?.[0]?.imageUrl ||
      `${SITE_URL}${DEFAULT_OG_IMAGE}`;

    const productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: [productImage],
      sku: product.variants?.[0]?.sku || undefined,
      url: `${SITE_URL}${productPath}`,
      brand: {
        "@type": "Brand",
        name: SITE_NAME,
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "VND",
        price: product.price,
        availability: product.isActive
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: `${SITE_URL}${productPath}`,
      },
    };

    return (
      <main className="min-h-screen" style={{ backgroundColor: "#F4F7FF" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <Header />
        <div className="pt-25">
          <ProductDetailClient product={product} related={related} personalizationRules={rules} />
        </div>
        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    notFound();
  }
}

