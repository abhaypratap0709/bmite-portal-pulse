import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import civilImg from "@/assets/Civil Engineering.jpeg";
import electronicsImg from "@/assets/Electronics & Communication.jpg";
import mechanicalImg from "@/assets/Mechanical Engineering.jpeg";
import computerImg from "@/assets/Computer Science Engineering.jpeg";

const FeaturedCourses = () => {
  const { t } = useTranslation();
  
  const courses = [
    {
      id: 1,
      name: t("courses.computerScience.name"),
      description: t("courses.computerScience.description"),
      seats: 120,
      duration: "4 " + t("courses.years"),
      image: computerImg,
      popular: true,
    },
    {
      id: 2,
      name: t("courses.mechanical.name"),
      description: t("courses.mechanical.description"),
      seats: 90,
      duration: "4 " + t("courses.years"),
      image: mechanicalImg,
      popular: false,
    },
    {
      id: 3,
      name: t("courses.electronics.name"),
      description: t("courses.electronics.description"),
      seats: 60,
      duration: "4 " + t("courses.years"),
      image: electronicsImg,
      popular: true,
    },
    {
      id: 4,
      name: t("courses.civil.name"),
      description: t("courses.civil.description"),
      seats: 60,
      duration: "4 " + t("courses.years"),
      image: civilImg,
      popular: false,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background" id="courses">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("courses.title")}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t("courses.subtitle")}
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
                  <Badge className="absolute right-2 top-2 bg-secondary">{t("courses.popular")}</Badge>
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
                    <span>{course.seats} {t("courses.seats")}</span>
                  </div>
                  <span>{course.duration}</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="ghost" className="w-full group/btn" asChild>
                  <a href="/admissions">
                    {t("courses.learnMore")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="default" size="lg" asChild>
            <a href="/admissions">{t("courses.viewAll")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
