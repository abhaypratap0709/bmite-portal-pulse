import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Plus, 
  Search, 
  Filter,
  Pin,
  Clock,
  User,
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
  Save,
  Edit3
} from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import toast from "react-hot-toast";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: string[];
  authorName: string;
  publishDate: string;
  formattedDate: string;
  timeAgo: string;
  isPinned: boolean;
  views: number;
  tags: string[];
  author: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
}

interface AnnouncementFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  targetAudience: string[];
  expiryDate: string;
  isPinned: boolean;
  tags: string[];
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: "",
    description: "",
    category: "General",
    priority: "medium",
    targetAudience: ["all"],
    expiryDate: "",
    isPinned: false,
    tags: [],
  });

  // Polling state
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());

  useEffect(() => {
    checkUserRole();
    fetchAnnouncements();
    
    // Set up polling every 10 seconds
    const pollInterval = setInterval(() => {
      fetchAnnouncements(true); // Silent fetch for polling
    }, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Make a request to check user role
      const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsAdmin(userData.data.role === 'admin' || userData.data.role === 'faculty');
      }
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const fetchAnnouncements = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory) params.append('category', filterCategory);
      if (filterPriority) params.append('priority', filterPriority);

      const response = await fetch(`${API_ENDPOINTS.ANNOUNCEMENTS.LIST}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnnouncements(result.data);
      setLastFetchTime(Date.now());
    } catch (err) {
      console.error('Error fetching announcements:', err);
      if (!silent) {
        setError("Failed to load announcements");
        toast.error("Failed to load announcements");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreating(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to create announcements");
        return;
      }

      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS.LIST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create announcement');
      }

      const result = await response.json();
      
      // Add the new announcement to the list
      setAnnouncements(prev => [result.data, ...prev]);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "General",
        priority: "medium",
        targetAudience: ["all"],
        expiryDate: "",
        isPinned: false,
        tags: [],
      });
      
      setShowCreateForm(false);
      toast.success("Announcement created successfully!");
    } catch (err) {
      console.error('Error creating announcement:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create announcement');
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'targetAudience') {
      const audience = value === 'all' ? ['all'] : [value];
      setFormData(prev => ({ ...prev, targetAudience: audience }));
    } else if (name === 'isPinned') {
      setFormData(prev => ({ ...prev, isPinned: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Info className="w-4 h-4 text-blue-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-gray-100 text-gray-800',
      'Academic': 'bg-blue-100 text-blue-800',
      'Examination': 'bg-purple-100 text-purple-800',
      'Placement': 'bg-green-100 text-green-800',
      'Event': 'bg-yellow-100 text-yellow-800',
      'Emergency': 'bg-red-100 text-red-800',
      'Maintenance': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchAnnouncements()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Announcements
          </h2>
          <p className="text-muted-foreground">Stay updated with the latest news and updates</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Academic">Academic</option>
            <option value="Examination">Examination</option>
            <option value="Placement">Placement</option>
            <option value="Event">Event</option>
            <option value="Emergency">Emergency</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <Button variant="outline" onClick={() => fetchAnnouncements()}>
            <Filter className="w-4 h-4 mr-2" />
            Apply
          </Button>
        </div>
      </div>

      {/* Create Announcement Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Create New Announcement</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Announcement title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Placement">Placement</option>
                    <option value="Event">Event</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Announcement description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <select
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience[0]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Users</option>
                    <option value="students">Students Only</option>
                    <option value="faculty">Faculty Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  name="isPinned"
                  checked={formData.isPinned}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="isPinned">Pin this announcement</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  <Save className="w-4 h-4 mr-2" />
                  {creating ? "Creating..." : "Create Announcement"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No announcements found</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement._id} className={`${announcement.isPinned ? 'border-primary bg-primary/5' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {announcement.isPinned && (
                        <Pin className="w-4 h-4 text-primary" />
                      )}
                      {getPriorityIcon(announcement.priority)}
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className={getCategoryColor(announcement.category)}>
                        {announcement.category}
                      </Badge>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                      {announcement.targetAudience.map((audience) => (
                        <Badge key={audience} variant="outline">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{announcement.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{announcement.formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{announcement.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{announcement.views} views</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {announcement.description}
                </p>
                {announcement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {announcement.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Auto-refreshing every 10 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
