import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  Edit3,
  Save,
  X,
  Camera,
  Upload,
  AlertCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "@/config/api";
import { createNameValidator, createPhoneValidator, useFormValidation } from "@/utils/validation";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

interface StudentProfile {
  id: string;
  email: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address: {
      street?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };
    avatar?: string;
    bio?: string;
    photoURL?: string;
  };
  academic: {
    course?: {
      _id: string;
      name: string;
      code: string;
      department: string;
      duration: {
        years: number;
        semesters: number;
      };
    };
    year?: number;
    semester?: number;
    rollNumber?: string;
    batch?: string;
    cgpa?: number;
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

const StudentProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form validation
  const firstNameValidator = createNameValidator('First Name');
  const lastNameValidator = createNameValidator('Last Name');
  const phoneValidator = createPhoneValidator();
  const firstNameValidation = useFormValidation(firstNameValidator);
  const lastNameValidation = useFormValidation(lastNameValidator);
  const phoneValidation = useFormValidation(phoneValidator);

  // Form state
  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  // Photo upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/dashboard");
      return;
    }
    fetchProfile(token);
  }, [navigate]);

  const fetchProfile = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.STUDENT.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 403) {
        setError("Access denied. Student privileges required.");
        setTimeout(() => navigate("/dashboard"), 2000);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setProfile(result.data);
      
      // Initialize form data
      setFormData({
        bio: result.data.profile.bio || "",
        phone: result.data.profile.phone || "",
        dateOfBirth: result.data.profile.dateOfBirth 
          ? new Date(result.data.profile.dateOfBirth).toISOString().split('T')[0]
          : "",
        gender: result.data.profile.gender || "",
        address: {
          street: result.data.profile.address?.street || "",
          city: result.data.profile.address?.city || "",
          state: result.data.profile.address?.state || "",
          pincode: result.data.profile.address?.pincode || "",
          country: result.data.profile.address?.country || "India",
        },
      });
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return null;

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(photoFile);
      const base64Data = await base64Promise;

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.STUDENT.PROFILE}/photo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photoData: base64Data }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const result = await response.json();
      return result.data.photoURL;
    } catch (error) {
      toast.error('Failed to upload photo');
      return null;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      
      // Upload photo if changed
      let photoURL = profile?.profile.photoURL;
      if (photoFile) {
        photoURL = await uploadPhoto();
        if (!photoURL) {
          setSaving(false);
          return;
        }
      }

      // Prepare update data
      const updateData: any = {
        bio: formData.bio,
        phone: formData.phone || null,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address,
      };

      if (photoURL) {
        updateData.photoURL = photoURL;
      }

      const response = await fetch(API_ENDPOINTS.STUDENT.PROFILE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      setProfile(result.data);
      setEditing(false);
      setPhotoFile(null);
      setPhotoPreview("");
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        bio: profile.profile.bio || "",
        phone: profile.profile.phone || "",
        dateOfBirth: profile.profile.dateOfBirth 
          ? new Date(profile.profile.dateOfBirth).toISOString().split('T')[0]
          : "",
        gender: profile.profile.gender || "",
        address: {
          street: profile.profile.address?.street || "",
          city: profile.profile.address?.city || "",
          state: profile.profile.address?.state || "",
          pincode: profile.profile.address?.pincode || "",
          country: profile.profile.address?.country || "India",
        },
      });
    }
    setEditing(false);
    setPhotoFile(null);
    setPhotoPreview("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No profile data available</p>
      </div>
    );
  }

  const fullName = `${profile.profile.firstName} ${profile.profile.lastName}`;
  const displayPhoto = photoPreview || profile.profile.photoURL || profile.profile.avatar;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Student Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and academic details</p>
              </div>
              {!editing ? (
                <Button onClick={() => setEditing(true)}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Photo & Basic Info */}
              <Card className="md:col-span-1">
                <CardHeader className="text-center">
                  <div className="relative inline-block">
                    {displayPhoto ? (
                      <img
                        src={displayPhoto}
                        alt={fullName}
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-4 border-primary/20">
                        <User className="w-16 h-16 text-primary" />
                      </div>
                    )}
                    {editing && (
                      <div className="absolute bottom-0 right-0">
                        <label className="cursor-pointer bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl">{fullName}</CardTitle>
                  <CardDescription>{profile.email}</CardDescription>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.academic.course && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{profile.academic.course.name}</span>
                    </div>
                  )}
                  {profile.academic.rollNumber && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Roll: {profile.academic.rollNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {editing ? (
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        maxLength={500}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground min-h-[60px] p-3 border rounded-md bg-muted/50">
                        {profile.profile.bio || "No bio added yet."}
                      </p>
                    )}
                    {editing && (
                      <p className="text-xs text-muted-foreground">
                        {formData.bio.length}/500 characters
                      </p>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {editing ? (
                        <>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                              handleInputChange(e);
                              phoneValidation.validateField('phone', e.target.value);
                              phoneValidation.markFieldTouched('phone');
                            }}
                            placeholder="10-digit phone number"
                            maxLength={10}
                            className={phoneValidation.getFieldError('phone') ? 'border-red-500 focus:border-red-500' : ''}
                          />
                          {phoneValidation.getFieldError('phone') && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              {phoneValidation.getFieldError('phone')}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {profile.profile.phone || "Not provided"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {editing ? (
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {profile.profile.dateOfBirth 
                              ? new Date(profile.profile.dateOfBirth).toLocaleDateString()
                              : "Not provided"
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      {editing ? (
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {profile.profile.gender 
                              ? profile.profile.gender.charAt(0).toUpperCase() + profile.profile.gender.slice(1)
                              : "Not specified"
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="address.street">Street</Label>
                        {editing ? (
                          <Input
                            id="address.street"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleInputChange}
                            placeholder="Street address"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                            {profile.profile.address?.street || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address.city">City</Label>
                        {editing ? (
                          <Input
                            id="address.city"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            placeholder="City"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                            {profile.profile.address?.city || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address.state">State</Label>
                        {editing ? (
                          <Input
                            id="address.state"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            placeholder="State"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                            {profile.profile.address?.state || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address.pincode">Pincode</Label>
                        {editing ? (
                          <Input
                            id="address.pincode"
                            name="address.pincode"
                            value={formData.address.pincode}
                            onChange={handleInputChange}
                            placeholder="6-digit pincode"
                            maxLength={6}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                            {profile.profile.address?.pincode || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              {profile.academic.course && (
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                    <CardDescription>Your current academic details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Course</Label>
                        <p className="text-sm font-medium">{profile.academic.course.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {profile.academic.course.code} • {profile.academic.course.department}
                        </p>
                      </div>

                      {profile.academic.year && (
                        <div className="space-y-2">
                          <Label>Academic Year</Label>
                          <p className="text-sm font-medium">Year {profile.academic.year}</p>
                          {profile.academic.semester && (
                            <p className="text-xs text-muted-foreground">
                              Semester {profile.academic.semester}
                            </p>
                          )}
                        </div>
                      )}

                      {profile.academic.batch && (
                        <div className="space-y-2">
                          <Label>Batch</Label>
                          <p className="text-sm font-medium">{profile.academic.batch}</p>
                          {profile.academic.cgpa && (
                            <p className="text-xs text-muted-foreground">
                              CGPA: {profile.academic.cgpa}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentProfile;
