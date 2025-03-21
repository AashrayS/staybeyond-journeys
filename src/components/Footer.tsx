
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16 pb-8 border-t border-teal-100 dark:border-teal-900/20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-lg bg-teal-400 text-white flex items-center justify-center overflow-hidden">
                <span className="font-bold text-xl">S</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-green-400 opacity-80" />
              </div>
              <span className="font-medium text-lg">StayBeyond</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Discover unique stays and experiences around the world with premium comfort and exceptional service.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-teal-500 hover:bg-teal-100/50">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-teal-500 hover:bg-teal-100/50">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-teal-500 hover:bg-teal-100/50">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-teal-500 hover:bg-teal-100/50">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-teal-950 dark:text-teal-100">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-300 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/press" className="text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Press</Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Support</Link>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-teal-950 dark:text-teal-100">Hosting</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/host" className="text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Try Hosting</Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Resources</Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Community</Link>
              </li>
              <li>
                <Link to="/responsible-hosting" className="text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Responsible Hosting</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-teal-950 dark:text-teal-100">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="h-10 border-teal-200 focus-visible:ring-teal-400" />
              <Button size="sm" className="h-10 bg-teal-400 hover:bg-teal-500 text-white">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-teal-100 dark:bg-teal-900/20" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Privacy</Link>
            <Link to="/sitemap" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Sitemap</Link>
            <Link to="/accessibility" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Accessibility</Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-sm gap-2 text-muted-foreground hover:text-teal-600 hover:bg-teal-50">
              <Globe className="h-4 w-4" />
              <span>English (US)</span>
            </Button>
            <span className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} StayBeyond
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
