import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import HowItWorks from "../components/home/HowItWorks";
import Collections from "../components/home/Collections";
import Testimonials from "../components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <HowItWorks />
      <Collections />
      <Testimonials />
      <Footer />
    </>
  );
}
