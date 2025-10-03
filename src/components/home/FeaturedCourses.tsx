import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users } from "lucide-react";
import engineeringImg from "@/assets/course-engineering.jpg";
import computerImg from "@/assets/course-computer.jpg";

const FeaturedCourses = () => {
  const courses = [
    {
      id: 1,
      name: "Computer Science Engineering",
      description: "Master the fundamentals of computing, AI, and software development.",
      seats: 120,
      duration: "4 Years",
      image: computerImg,
      popular: true,
    },
    {
      id: 2,
      name: "Mechanical Engineering",
      description: "Design, analyze and manufacture innovative mechanical systems.",
      seats: 90,
      duration: "4 Years",
      image: engineeringImg,
      popular: false,
    },
    {
      id: 3,
      name: "Electronics & Communication",
      description: "Explore cutting-edge electronics and communication technologies.",
      seats: 60,
      duration: "4 Years",
      image: computerImg,
      popular: true,
    },
    {
      id: 4,
      name: "Civil Engineering",
      description: "Build the infrastructure of tomorrow with sustainable design.",
      seats: 60,
      duration: "4 Years",
      image: engineeringImg,
      popular: false,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/50" id="courses">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Featured <span className="text-primary">Courses</span></h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our world-class engineering programs designed to prepare you for the challenges of tomorrow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => (
            <Card 
              key={course.id} 
              className="group overflow-hidden transition-all hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {course.popular && (
                  <Badge className="absolute right-2 top-2 bg-secondary">Popular</Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">{course.name}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.seats} Seats</span>
                  </div>
                  <span>{course.duration}</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="ghost" className="w-full group/btn" asChild>
                  <a href="/admissions">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="default" size="lg" asChild>
            <a href="/admissions">View All Courses</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
