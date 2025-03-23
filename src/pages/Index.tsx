
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedProperties from "../components/FeaturedProperties";
import TransportOptions from "../components/TransportOptions";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { ScrollArea } from "@/components/ui/scroll-area";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import PopularDestinations from "@/components/PopularDestinations";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set loaded state after a small delay for animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  // Staggered section variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const sectionVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen flex flex-col bg-background"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Helmet>
          <title>Stayz India | Find Your Perfect Rental Property</title>
          <meta name="description" content="Book unique homes, vacation rentals, and experiences across India. Find the perfect place for your next trip." />
          <meta property="og:title" content="Stayz India | Find Your Perfect Rental Property" />
          <meta property="og:description" content="Book unique homes, vacation rentals, and experiences across India. Find the perfect place for your next trip." />
          <meta property="og:image" content="/og-image.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="canonical" href="https://stayzindia.com" />
        </Helmet>
        
        <Header />
        
        <main className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            <motion.div 
              className="space-y-20 overflow-hidden"
              variants={containerVariants}
              initial="initial"
              animate={isLoaded ? "animate" : "initial"}
            >
              <motion.section variants={sectionVariants}>
                <Hero />
              </motion.section>
              
              <motion.section variants={sectionVariants}>
                <PopularDestinations />
              </motion.section>
              
              <motion.section variants={sectionVariants}>
                <FeaturedProperties />
              </motion.section>
              
              <motion.section variants={sectionVariants}>
                <TestimonialsSection />
              </motion.section>
              
              <motion.section variants={sectionVariants}>
                <TransportOptions />
              </motion.section>
              
              <motion.section variants={sectionVariants}>
                <NewsletterSignup />
              </motion.section>
            </motion.div>
          </ScrollArea>
        </main>
        
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
