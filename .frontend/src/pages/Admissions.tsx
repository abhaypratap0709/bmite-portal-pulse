import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Calendar, FileText, CreditCard, UserCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Admissions = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [tuition, setTuition] = useState(0);
  const [hostel, setHostel] = useState(0);
  const [other, setOther] = useState(0);

  const admissionSteps = [
    {
      step: 1,
      title: "Application Form",
      description: "Fill out the online application form",
      icon: FileText,
      date: "March 1 - May 31",
    },
    {
      step: 2,
      title: "Entrance Test",
      description: "Appear for entrance examination",
      icon: UserCheck,
      date: "June 15",
    },
    {
      step: 3,
      title: "Document Verification",
      description: "Submit required documents for verification",
      icon: CheckCircle2,
      date: "June 20 - June 25",
    },
    {
      step: 4,
      title: "Fee Payment",
      description: "Complete the admission fee payment",
      icon: CreditCard,
      date: "June 30",
    },
  ];

  const courses = [
    { name: "Computer Science Engineering", fee: 150000 },
    { name: "Mechanical Engineering", fee: 120000 },
    { name: "Electronics & Communication", fee: 130000 },
    { name: "Civil Engineering", fee: 110000 },
    { name: "Electrical Engineering", fee: 120000 },
  ];

  const handleCourseChange = (courseName: string) => {
    setSelectedCourse(courseName);
    const course = courses.find(c => c.name === courseName);
    if (course) {
      setTuition(course.fee);
    }
  };

  const total = tuition + hostel + other;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Admissions 2024-25</h1>
            <p className="mx-auto max-w-2xl text-lg opacity-90">
              Begin your journey towards excellence. Join BMIET and shape your engineering career.
            </p>
          </div>
        </section>

        {/* Admission Timeline */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Admission <span className="text-primary">Timeline</span>
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {admissionSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card 
                    key={step.step}
                    className="group cursor-pointer transition-all hover:shadow-lg animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                          {step.step}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{step.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Fee Calculator */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-8 text-center text-3xl font-bold">
                Fee <span className="text-primary">Calculator</span>
              </h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estimate Your Total Fees</CardTitle>
                  <CardDescription>
                    Calculate your total annual fees including tuition, hostel, and other charges.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="course">Select Course</Label>
                    <Select value={selectedCourse} onValueChange={handleCourseChange}>
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Choose your course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.name} value={course.name}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tuition">Tuition Fees (₹)</Label>
                    <Input
                      id="tuition"
                      type="number"
                      value={tuition}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hostel">Hostel Fees (₹)</Label>
                    <Input
                      id="hostel"
                      type="number"
                      value={hostel}
                      onChange={(e) => setHostel(Number(e.target.value))}
                      placeholder="Enter hostel fees (if applicable)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="other">Other Fees (₹)</Label>
                    <Input
                      id="other"
                      type="number"
                      value={other}
                      onChange={(e) => setOther(Number(e.target.value))}
                      placeholder="Enter other fees (books, transport, etc.)"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Total Annual Fees:</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹ {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Course Catalog */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Available <span className="text-primary">Courses</span>
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <Card 
                  key={course.name}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription>Annual Fee: ₹{course.fee.toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Admissions;
