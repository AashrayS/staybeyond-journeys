
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthNavigation from "./AuthNavigation";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-2 shadow-sm"
          : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg bg-teal-400 text-white flex items-center justify-center overflow-hidden">
            <span className="font-bold text-xl">S</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-green-400 opacity-80" />
          </div>
          <span className={cn(
            "font-medium text-lg transition-all duration-300",
            scrolled ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"
          )}>
            StayBeyond
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            to="/"
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
              location.pathname === "/" 
                ? "text-teal-500" 
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            )}
          >
            Home
          </Link>
          <Link 
            to="/properties"
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
              location.pathname === "/properties" 
                ? "text-teal-500" 
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            )}
          >
            Properties
          </Link>
          <Link 
            to="/transport"
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
              location.pathname === "/transport" 
                ? "text-teal-500" 
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            )}
          >
            Transport
          </Link>
        </nav>

        {/* Desktop Right-side Items */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild className="border-teal-100 hover:bg-teal-50">
            <Link to="/properties" className="flex items-center gap-2">
              <Search className="h-4 w-4 text-teal-500" />
              <span className="text-teal-700">Search</span>
            </Link>
          </Button>

          <AuthNavigation />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
              <div className="flex flex-col space-y-6 mt-8">
                <Link to="/" className="text-lg font-medium py-2 text-teal-700 dark:text-teal-300">Home</Link>
                <Link to="/properties" className="text-lg font-medium py-2 text-gray-700 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-300">Properties</Link>
                <Link to="/transport" className="text-lg font-medium py-2 text-gray-700 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-300">Transport</Link>
                
                <div className="border-t border-teal-100 dark:border-teal-900/30 pt-6">
                  <Link to="/auth" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-300">
                    <Button className="w-full bg-teal-400 hover:bg-teal-500 text-white">Login / Sign Up</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
