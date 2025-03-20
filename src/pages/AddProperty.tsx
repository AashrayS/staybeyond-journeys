
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { amenitiesList, propertyTypes } from "@/data/mockData";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AddProperty = () => {
  const { user, isHost } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    country: "India",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    capacity: "",
    propertyType: "Apartment",
    amenities: [] as string[],
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        amenities: prev.amenities.filter((a) => a !== amenity),
      }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to list a property",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload images to storage
      const imageUrls: string[] = [];
      
      for (const image of images) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from("property_images")
          .upload(fileName, image);
          
        if (error) {
          throw error;
        }
        
        const { data: urlData } = supabase.storage
          .from("property_images")
          .getPublicUrl(data.path);
          
        imageUrls.push(urlData.publicUrl);
      }
      
      // Create property record
      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: {
          city: formData.city,
          country: formData.country,
          address: formData.address,
        },
        price: parseInt(formData.price),
        currency: "INR",
        images: imageUrls,
        amenities: formData.amenities,
        host_id: user.id,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        capacity: parseInt(formData.capacity),
        property_type: formData.propertyType,
      };
      
      const { data, error } = await supabase
        .from("properties")
        .insert(propertyData)
        .select("id")
        .single();
        
      if (error) {
        throw error;
      }
      
      // If user is not already a host, update their profile
      if (!isHost) {
        await supabase
          .from("profiles")
          .update({ is_host: true })
          .eq("id", user.id);
      }
      
      toast({
        title: "Property listed successfully!",
        description: "Your property has been added to our listings.",
      });
      
      navigate(`/properties/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error listing property",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">List Your Property</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Cozy apartment in South Mumbai"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows={5}
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Location</h2>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="India"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price per night (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="5000"
                  min="1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleSelectChange("propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="2"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="1.5"
                  min="0"
                  step="0.5"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Max Guests</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="4"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                  />
                  <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Images</h2>
            <div className="space-y-2">
              <Label htmlFor="images">Upload Property Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500">
                Upload at least one image of your property (max 5)
              </p>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Property preview ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "List Property"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AddProperty;
