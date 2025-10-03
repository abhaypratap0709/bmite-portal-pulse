import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, BookOpen, FileText, User, LogIn } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would validate credentials
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleForgotPassword = () => {
    alert("Password reset link will be sent to your registered email.");
  };

  // Mock student data
  const studentData = {
    name: "Rahul Kumar",
    studentId: "BMIET2024CS001",
    course: "Computer Science Engineering",
    semester: "4th Semester",
    progress: 65,
    upcomingClasses: [
      { subject: "Data Structures", time: "9:00 AM - 10:30 AM", room: "Lab 301" },
      { subject: "Database Management", time: "11:00 AM - 12:30 PM", room: "Room 205" },
      { subject: "Computer Networks", time: "2:00 PM - 3:30 PM", room: "Room 310" },
    ],
    resources: [
      { name: "Course Materials", icon: BookOpen },
      { name: "Assignments", icon: FileText },
      { name: "Attendance", icon: Calendar },
      { name: "Profile", icon: User },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        {!isLoggedIn ? (
          // Login Form
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-md">
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                      <LogIn className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Student Portal Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="student@bmiet.edu.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={handleForgotPassword}
                      >
                        Forgot Password?
                      </Button>

                      <Button type="submit" className="w-full" size="lg">
                        Login
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        ) : (
          // Student Dashboard
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              {/* Welcome Section */}
              <div className="mb-8 animate-fade-in">
                <h1 className="mb-2 text-3xl font-bold">Welcome back, {studentData.name}!</h1>
                <p className="text-muted-foreground">
                  {studentData.studentId} • {studentData.course}
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Main Content */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Course Progress */}
                  <Card className="animate-slide-up">
                    <CardHeader>
                      <CardTitle>Course Progress</CardTitle>
                      <CardDescription>{studentData.semester}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Overall Completion</span>
                          <span className="font-semibold text-primary">{studentData.progress}%</span>
                        </div>
                        <Progress value={studentData.progress} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Classes */}
                  <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Today's Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {studentData.upcomingClasses.map((class_, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between border-l-4 border-primary bg-muted/50 p-4 rounded-r"
                          >
                            <div>
                              <div className="font-semibold">{class_.subject}</div>
                              <div className="text-sm text-muted-foreground">{class_.room}</div>
                            </div>
                            <div className="text-sm font-medium text-primary">{class_.time}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Quick Links */}
                <div className="space-y-6">
                  <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    <CardHeader>
                      <CardTitle>Quick Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {studentData.resources.map((resource, index) => {
                          const Icon = resource.icon;
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              className="justify-start"
                              asChild
                            >
                              <a href="#">
                                <Icon className="mr-2 h-4 w-4" />
                                {resource.name}
                              </a>
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                    <CardHeader>
                      <CardTitle>Announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="border-l-2 border-secondary pl-3">
                          <div className="font-medium">Mid-term exams start next week</div>
                          <div className="text-xs text-muted-foreground">2 days ago</div>
                        </div>
                        <div className="border-l-2 border-primary pl-3">
                          <div className="font-medium">New assignment posted in Database Management</div>
                          <div className="text-xs text-muted-foreground">5 days ago</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
