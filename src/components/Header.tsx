
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, X, Globe, User, Heart, LogOut, LogIn, PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  // Example authentication toggle - in a real app this would use authentication state
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

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
          <div className="relative w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center overflow-hidden">
            <span className="font-bold text-xl">S</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary/50 opacity-50" />
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
                ? "text-primary" 
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
                ? "text-primary" 
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
                ? "text-primary" 
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            )}
          >
            Transport
          </Link>
        </nav>

        {/* Desktop Right-side Items */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/properties" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/host" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Host Property</span>
                </Link>
              </Button>
              <Link to="/wishlist" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <Heart className="h-5 w-5" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookings" className="cursor-pointer flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleAuth} className="cursor-pointer flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={toggleAuth} className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
              <Button variant="default" onClick={toggleAuth}>Sign up</Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="text-lg font-medium py-2">Home</Link>
                <Link to="/properties" className="text-lg font-medium py-2">Properties</Link>
                <Link to="/transport" className="text-lg font-medium py-2">Transport</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/host" className="text-lg font-medium py-2">Host Property</Link>
                    <Link to="/wishlist" className="text-lg font-medium py-2">Wishlist</Link>
                    <Link to="/bookings" className="text-lg font-medium py-2">My Bookings</Link>
                    <Link to="/profile" className="text-lg font-medium py-2">Profile</Link>
                  </>
                )}
                <div className="pt-4 mt-4 border-t">
                  {isAuthenticated ? (
                    <Button onClick={toggleAuth} className="w-full">Log out</Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" onClick={toggleAuth} className="w-full">Login</Button>
                      <Button onClick={toggleAuth} className="w-full">Sign up</Button>
                    </div>
                  )}
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
