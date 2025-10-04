import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, BookOpen, Target, Globe, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, label: "Students", value: "5000+", color: "text-blue-600" },
    { icon: Award, label: "Awards", value: "50+", color: "text-yellow-600" },
    { icon: BookOpen, label: "Courses", value: "15+", color: "text-green-600" },
    { icon: Target, label: "Placement Rate", value: "97%", color: "text-purple-600" },
  ];

  const values = [
    {
      icon: Globe,
      title: "Global Perspective",
      description: "Preparing students for international opportunities and global challenges."
    },
    {
      icon: Heart,
      title: "Student-Centric",
      description: "Every decision is made with student success and well-being in mind."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to maintaining the highest standards in education and research."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive community that fosters growth and collaboration."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-primary">BMIET</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Bhagwan Mahaveer Institute of Engineering & Technology - Shaping the future of engineering education in India.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide world-class engineering education that empowers students to become innovative leaders, 
                  critical thinkers, and responsible citizens who contribute to the advancement of technology and society.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be recognized as a premier engineering institution that produces globally competitive engineers 
                  and researchers, driving technological innovation and contributing to sustainable development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These values guide everything we do and shape the culture of our institution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="px-3 py-1">2010</Badge>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Foundation</h3>
                  <p className="text-muted-foreground">
                    BMIET was established with a vision to provide quality engineering education in the heart of India.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="px-3 py-1">2015</Badge>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Recognition</h3>
                  <p className="text-muted-foreground">
                    Achieved AICTE approval and established partnerships with leading industries.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="px-3 py-1">2020</Badge>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Digital Transformation</h3>
                  <p className="text-muted-foreground">
                    Launched modern digital infrastructure and online learning platforms.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="px-3 py-1">2025</Badge>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Innovation Hub</h3>
                  <p className="text-muted-foreground">
                    Established as a center of excellence with cutting-edge research facilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
