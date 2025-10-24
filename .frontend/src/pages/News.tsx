import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Newspaper, 
  Calendar, 
  User, 
  Eye, 
  Heart,
  Star,
  Tag,
  Clock,
  TrendingUp
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsSearchAndFilter from "@/components/NewsSearchAndFilter";
import { API_ENDPOINTS } from "@/config/api";
import toast from "react-hot-toast";

interface NewsArticle {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  authorName: string;
  publishDate: string;
  formattedDate: string;
  timeAgo: string;
  featured: boolean;
  views: number;
  likes: number;
  tags: string[];
  author: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
}

interface NewsFilters {
  category: string;
  featured: string;
  sort: string;
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as string[],
    tags: [] as string[],
  });
  const [totalArticles, setTotalArticles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async (searchQuery = "", filters: NewsFilters = {
    category: "",
    featured: "",
    sort: "-publishDate",
  }) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filters.category) params.append('category', filters.category);
      if (filters.featured) params.append('featured', filters.featured);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const response = await fetch(`${API_ENDPOINTS.NEWS.LIST}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setArticles(result.data);
      setTotalArticles(result.total);
      setTotalPages(result.pages);
      
      // Set available filters from API response
      if (result.filters) {
        setAvailableFilters({
          categories: result.filters.categories || [],
          tags: result.filters.tags || [],
        });
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError("Failed to load news articles");
      toast.error("Failed to load news articles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndFilter = ({ q, filters }: { q: string; filters: NewsFilters }) => {
    setCurrentPage(1); // Reset to first page when searching/filtering
    fetchNews(q, filters);
  };

  const handleLike = async (articleId: string) => {
    try {
      const response = await fetch(`${API_URL}/news/${articleId}/like`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Update the likes count locally
        setArticles(prev => prev.map(article => 
          article._id === articleId 
            ? { ...article, likes: article.likes + 1 }
            : article
        ));
      }
    } catch (err) {
      console.error('Error liking article:', err);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-gray-100 text-gray-800',
      'Achievements': 'bg-blue-100 text-blue-800',
      'Events': 'bg-green-100 text-green-800',
      'Admissions': 'bg-purple-100 text-purple-800',
      'Research': 'bg-orange-100 text-orange-800',
      'Announcements': 'bg-red-100 text-red-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading news...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Latest News</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest news and announcements from BMIET
            </p>
            <div className="mt-4">
              <Badge variant="secondary" className="text-sm">
                {totalArticles} articles available
              </Badge>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <NewsSearchAndFilter
              onSearchAndFilter={handleSearchAndFilter}
              availableFilters={availableFilters}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchNews()}>Retry</Button>
            </div>
          )}

          {/* News Grid */}
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card key={article._id} className={`group hover:shadow-lg transition-all duration-300 ${article.featured ? 'border-primary bg-primary/5' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {article.featured && (
                          <Star className="w-4 h-4 text-primary" />
                        )}
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {article.timeAgo}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.excerpt || article.content.substring(0, 150) + '...'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Author and Date */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.authorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{article.formattedDate}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 4).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {article.tags.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{article.tags.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{article.likes}</span>
                        </div>
                      </div>
                      {article.featured && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <div className="px-6 pb-6">
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Read More
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(article._id)}
                        className="px-3"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 py-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default News;
