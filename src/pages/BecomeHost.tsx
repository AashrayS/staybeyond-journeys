
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChevronRight, Home, DollarSign, Users, Star, Shield } from "lucide-react";

const BecomeHost = () => {
  const { user, isHost } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleBecomeHost = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to become a host",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      
      // Update user profile to mark as host
      const { error } = await supabase
        .from("profiles")
        .update({ is_host: true })
        .eq("id", user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success!",
        description: "You are now a host. You can start listing properties.",
      });
      
      // Redirect to add property page
      navigate("/add-property");
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-7xl mx-auto py-12 px-4">
        <section className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-800 dark:text-purple-300 mb-4">
              Become a Host
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Share your space, earn extra income, and connect with travelers from around the world.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Beautiful home interior" 
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-purple-700 dark:text-purple-400">
                Why Host with StayBeyond?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-medium">Earn extra income</h3>
                    <p className="text-gray-600 dark:text-gray-400">Turn your extra space into a steady source of income.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-medium">Meet interesting people</h3>
                    <p className="text-gray-600 dark:text-gray-400">Connect with travelers from all over the world.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-medium">Host with confidence</h3>
                    <p className="text-gray-600 dark:text-gray-400">We verify guests and provide host protection insurance.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="mt-6 bg-purple-600 hover:bg-purple-700"
                onClick={handleBecomeHost}
                disabled={loading || isHost}
              >
                {isHost ? "You're already a host" : loading ? "Processing..." : "Get Started"}
                {!isHost && !loading && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
              
              {isHost && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Ready to add a property? <a href="/add-property" className="text-purple-600 hover:underline">List your property now</a>
                </p>
              )}
            </div>
          </div>
        </section>
        
        <section className="my-16">
          <h2 className="text-3xl font-semibold text-center text-purple-800 dark:text-purple-300 mb-10">
            How Hosting Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-100 dark:border-gray-700">
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>List your space</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a listing page with photos, details, and pricing for your space. It's free to create!
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-100 dark:border-gray-700">
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Welcome guests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Once your listing is live, guests can book your space. You control your availability and house rules.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-100 dark:border-gray-700">
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Get paid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  We handle payments and release funds to you 24 hours after your guest's check-in.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="my-16">
          <Card className="border-purple-100 dark:border-gray-700 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <CardContent className="p-8 flex flex-col justify-center">
                <CardTitle className="text-2xl mb-4">Ready to get started?</CardTitle>
                <CardDescription className="text-base mb-6">
                  Join thousands of hosts who are already earning extra income by sharing their spaces.
                </CardDescription>
                <Button 
                  size="lg" 
                  className="w-fit bg-purple-600 hover:bg-purple-700"
                  onClick={handleBecomeHost}
                  disabled={loading || isHost}
                >
                  {isHost ? "You're already a host" : loading ? "Processing..." : "Become a Host"}
                </Button>
              </CardContent>
              <div className="relative h-72 md:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Host welcoming guests" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeHost;
