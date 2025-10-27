import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, BookOpen, FileText, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin, isFaculty } = useAuth();

  // Redirect admin/faculty to admin dashboard
  useEffect(() => {
    if (isAdmin || isFaculty) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAdmin, isFaculty, navigate]);

  // Mock student data for display
  const studentData = {
    name: user ? `${user.profile.firstName || ""} ${user.profile.lastName || ""}`.trim() || user.email : "Student",
    studentId: user?.id?.slice(-8).toUpperCase() || "BMIET2024",
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
      
      <main className="flex-1 bg-background">
        {/* Student Dashboard */}
        <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              {/* Welcome Section */}
              <div className="mb-8 animate-fade-in flex justify-between items-start">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">Welcome back, {studentData.name}!</h1>
                  <p className="text-muted-foreground">
                    {studentData.studentId} • {studentData.course}
                  </p>
                </div>
                <Button variant="outline" onClick={() => { logout(); navigate("/"); }}>
                  Logout
                </Button>
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
                            className="flex items-start justify-between border-l-4 border-primary bg-card p-4 rounded-r"
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
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
