import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import ServiceArea from "@/components/ServiceArea";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Services />
      <Pricing />
      <Gallery />
      <Reviews />
      <ServiceArea />
      <Contact />
      <Footer />
    </>
  );
}
