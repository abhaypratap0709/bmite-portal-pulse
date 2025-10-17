import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Clock,
  LogOut
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

interface DashboardStats {
  totalStudents: number;
  totalApplications: number;
  pendingApplications: number;
  totalCourses: number;
}

interface Application {
  _id: string;
  userId: {
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  courseId: {
    name: string;
    code: string;
  };
  status: string;
  submittedAt: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "applications" | "courses" | "news">("dashboard");
  const [error, setError] = useState("");

  // News form state
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsCategory, setNewsCategory] = useState("announcement");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/dashboard");
      return;
    }
    fetchAdminData(token);
  }, [navigate]);

  const fetchAdminData = async (token: string) => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsRes = await fetch(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (statsRes.status === 403) {
        setError("Access denied. Admin privileges required.");
        setTimeout(() => navigate("/dashboard"), 2000);
        return;
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }

      // Fetch applications
      const appsRes = await fetch(`${API_URL}/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData.data);
      }

    } catch (err) {
      // Failed to fetch admin data
      // TODO: Implement proper error handling/logging service
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/admin/applications/${appId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh applications
        fetchAdminData(token);
        alert(`Application ${newStatus} successfully!`);
      } else {
        alert("Failed to update application status");
      }
    } catch (err) {
      // Error updating application status
      // TODO: Implement proper error handling/logging service
      alert("Error updating application");
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/admin/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newsTitle,
          content: newsContent,
          category: newsCategory,
          author: "Admin",
        }),
      });

      if (response.ok) {
        alert("News article created successfully!");
        setNewsTitle("");
        setNewsContent("");
        setNewsCategory("announcement");
      } else {
        alert("Failed to create news article");
      }
    } catch (err) {
      // Error creating news article
      // TODO: Implement proper error handling/logging service
      alert("Error creating news");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/dashboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800 border-green-300";
      case "rejected": return "bg-red-100 text-red-800 border-red-300";
      case "under-review": return "bg-blue-100 text-blue-800 border-blue-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                <p className="text-muted-foreground">Manage your institution's portal</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 border-b">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "dashboard"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "applications"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab("news")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "news"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                News Management
              </button>
            </div>

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && stats && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">Registered users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalApplications}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingApplications}</div>
                    <p className="text-xs text-muted-foreground">Need attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCourses}</div>
                    <p className="text-xs text-muted-foreground">Available programs</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Management</CardTitle>
                    <CardDescription>Review and process student applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {applications.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No applications found</p>
                    ) : (
                      <div className="space-y-4">
                        {applications.map((app) => (
                          <div
                            key={app._id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                          >
                            <div className="flex-1">
                              <div className="font-semibold">
                                {app.userId.profile?.firstName} {app.userId.profile?.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">{app.userId.email}</div>
                              <div className="text-sm mt-1">
                                <span className="font-medium">{app.courseId.name}</span>
                                <span className="text-muted-foreground"> ({app.courseId.code})</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(app.status)}>
                                {app.status}
                              </Badge>
                              
                              {app.status === "submitted" || app.status === "under-review" ? (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleUpdateApplicationStatus(app._id, "accepted")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleUpdateApplicationStatus(app._id, "rejected")}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <div className="px-4 py-2 text-sm text-muted-foreground">
                                  Processed
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* News Management Tab */}
            {activeTab === "news" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create News Article</CardTitle>
                    <CardDescription>Publish news and announcements for students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateNews} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Article Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter article title"
                          value={newsTitle}
                          onChange={(e) => setNewsTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          value={newsCategory}
                          onChange={(e) => setNewsCategory(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="announcement">Announcement</option>
                          <option value="event">Event</option>
                          <option value="achievement">Achievement</option>
                          <option value="admission">Admission</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <textarea
                          id="content"
                          placeholder="Enter article content"
                          value={newsContent}
                          onChange={(e) => setNewsContent(e.target.value)}
                          required
                          rows={6}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>

                      <Button type="submit" size="lg">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Publish Article
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;

