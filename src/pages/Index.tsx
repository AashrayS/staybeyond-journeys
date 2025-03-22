
import { useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedProperties from "../components/FeaturedProperties";
import TransportOptions from "../components/TransportOptions";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const Index = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Stayz India | Find Your Perfect Rental Property</title>
        <meta name="description" content="Book unique homes, vacation rentals, and experiences across India. Find the perfect place for your next trip." />
      </Helmet>
      <Header />
      <main className="flex-grow">
        <Hero />
        <FeaturedProperties />
        <TransportOptions />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
