import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { Progress } from "@/components/ui/progress";
import { Calendar, BookOpen, FileText, User, LogIn } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/config/api";
import { UserData } from "@/types";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
        
        // Redirect admin users to admin panel
        if (data.data.role === "admin" || data.data.role === "faculty") {
          navigate("/admin");
          return;
        }
        
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      // Failed to fetch user profile - clear invalid token
      // TODO: Implement proper error handling/logging service
      localStorage.removeItem("token");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.data.accessToken);
        setUserData(data.data.user);
        
        toast.success(`Welcome back, ${data.data.user.profile?.firstName || data.data.user.email}!`);
        
        // Redirect admin users to admin panel
        if (data.data.user.role === "admin" || data.data.user.role === "faculty") {
          navigate("/admin");
          return;
        }
        
        setIsLoggedIn(true);
      } else {
        const errorMessage = data.message || "Login failed. Please check your credentials.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = "Unable to connect to server. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserData(null);
    setEmail("");
    setPassword("");
    navigate("/");
  };

  const handleForgotPassword = () => {
    toast.success("Password reset link will be sent to your registered email.");
  };

  // Mock student data for display
  const studentData = {
    name: userData ? `${userData.profile?.firstName || ""} ${userData.profile?.lastName || ""}`.trim() || userData.email : "Student",
    studentId: userData?._id?.slice(-8).toUpperCase() || "BMIET2024",
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
                      {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                          {error}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="student@bmiet.edu.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
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
                          disabled={loading}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={handleForgotPassword}
                        disabled={loading}
                      >
                        Forgot Password?
                      </Button>

                      <LoadingButton 
                        type="submit" 
                        className="w-full" 
                        size="lg" 
                        loading={loading}
                        loadingText="Logging in..."
                      >
                        Login
                      </LoadingButton>
                      
                      <div className="text-xs text-muted-foreground text-center mt-4">
                        <p>Test credentials:</p>
                        <p>Student: rahul.sharma@bmiet.edu.in / student123</p>
                        <p>Student: priya.patel@bmiet.edu.in / student123</p>
                      </div>
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
              <div className="mb-8 animate-fade-in flex justify-between items-start">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">Welcome back, {studentData.name}!</h1>
                  <p className="text-muted-foreground">
                    {studentData.studentId} • {studentData.course}
                  </p>
                </div>
                <LoadingButton variant="outline" onClick={handleLogout}>
                  Logout
                </LoadingButton>
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
