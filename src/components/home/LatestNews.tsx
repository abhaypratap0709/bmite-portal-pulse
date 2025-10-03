import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";

const LatestNews = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Events", "Achievements", "Admissions", "Research"];

  const newsItems = [
    {
      id: 1,
      title: "BMIET Students Win National Hackathon 2024",
      description: "Our CSE students secured first place at the National Innovation Challenge.",
      date: "2024-03-15",
      category: "Achievements",
    },
    {
      id: 2,
      title: "New Research Lab Inaugurated",
      description: "State-of-the-art AI and Machine Learning research facility opens this month.",
      date: "2024-03-10",
      category: "Research",
    },
    {
      id: 3,
      title: "Admission Process for 2024-25 Begins",
      description: "Applications now open for all undergraduate and postgraduate programs.",
      date: "2024-03-08",
      category: "Admissions",
    },
    {
      id: 4,
      title: "Annual Tech Fest 'Innovate 2024'",
      description: "Three-day technical festival featuring workshops, competitions, and guest lectures.",
      date: "2024-03-05",
      category: "Events",
    },
    {
      id: 5,
      title: "Partnership with Leading Tech Companies",
      description: "BMIET signs MoUs with top IT firms for industry collaboration and placements.",
      date: "2024-03-01",
      category: "Achievements",
    },
    {
      id: 6,
      title: "Guest Lecture by Industry Expert",
      description: "Renowned AI researcher to deliver keynote on Future of Technology.",
      date: "2024-02-28",
      category: "Events",
    },
  ];

  const filteredNews = selectedCategory === "All" 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section className="py-16 md:py-24 bg-background" id="news">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Latest <span className="text-primary">News</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Stay updated with the latest happenings, achievements, and events at BMIET.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((news, index) => (
            <Card 
              key={news.id} 
              className="group cursor-pointer transition-all hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="secondary">{news.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(news.date)}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                  {news.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {news.description}
                </CardDescription>
                <Button variant="ghost" size="sm" className="group/btn p-0">
                  Read More
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
