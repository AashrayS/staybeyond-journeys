
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Ananya Sharma",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    role: "Frequent Traveler",
    quote: "Stayz India has transformed the way I travel. The homes are beautiful, hosts are welcoming, and the entire experience feels authentic and local."
  },
  {
    id: 2,
    name: "Rajesh Patel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    role: "Business Traveler",
    quote: "As someone who travels frequently for work, finding comfortable accommodations is important. Stayz India consistently provides great options with all the amenities I need."
  },
  {
    id: 3,
    name: "Priya Singh",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    role: "Family Vacationer",
    quote: "We've had amazing family vacations thanks to Stayz India. The properties are child-friendly and spacious, making our trips stress-free and enjoyable for everyone."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Guests Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what travelers across India have to say about their Stayz experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-6 flex-grow">
                    <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
