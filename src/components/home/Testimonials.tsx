import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Software Engineer at Google",
      batch: "Class of 2022",
      content: "BMIET provided me with the perfect blend of theoretical knowledge and practical skills. The faculty's guidance and the state-of-the-art infrastructure prepared me well for my career in tech.",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Mechanical Engineer at Tesla",
      batch: "Class of 2021",
      content: "The hands-on projects and industry exposure at BMIET were invaluable. The placement cell worked tirelessly to ensure we got opportunities at top companies.",
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "Data Scientist at Amazon",
      batch: "Class of 2023",
      content: "BMIET's focus on emerging technologies like AI and ML gave me a competitive edge. The research opportunities and mentorship I received were exceptional.",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      role: "Civil Engineer at L&T",
      batch: "Class of 2020",
      content: "The infrastructure design projects and industry visits organized by BMIET gave me real-world experience that proved invaluable in my career.",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Student <span className="text-primary">Testimonials</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Hear from our successful alumni about their transformative journey at BMIET.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <Card className="overflow-hidden border-2 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <Quote className="mb-6 h-12 w-12 text-primary/20" />
              
              <div className="animate-fade-in" key={currentIndex}>
                <p className="mb-6 text-lg italic leading-relaxed text-foreground md:text-xl">
                  "{testimonials[currentIndex].content}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonials[currentIndex].name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonials[currentIndex].batch}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? "w-8 bg-primary" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
