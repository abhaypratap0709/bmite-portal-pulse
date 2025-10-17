import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Building2, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

const PlacementHighlights = () => {
  const { t } = useTranslation();
  const yearlyData = [
    { year: "2020", placed: 85 },
    { year: "2021", placed: 88 },
    { year: "2022", placed: 92 },
    { year: "2023", placed: 95 },
    { year: "2024", placed: 97 },
  ];

  const sectorData = [
    { name: "IT & Software", value: 45, color: "#1E3A8A" },
    { name: "Core Engineering", value: 25, color: "#F5A623" },
    { name: "Consulting", value: 15, color: "#3B82F6" },
    { name: "Others", value: 15, color: "#94A3B8" },
  ];

  const topRecruiters = [
    "TCS", "Infosys", "Wipro", "Amazon", "Microsoft", "Google", "Accenture", "Cognizant"
  ];

  return (
    <section className="py-16 md:py-24 bg-background" id="placements">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t("placements.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t("placements.subtitle")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t("placements.placementRate")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">97%</div>
              <p className="text-xs text-muted-foreground">{t("placements.classOf")} 2024</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t("placements.topPackage")}</CardTitle>
              <DollarSign className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₹45 LPA</div>
              <p className="text-xs text-muted-foreground">Highest this year</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t("placements.companies")}</CardTitle>
              <Building2 className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">150+</div>
              <p className="text-xs text-muted-foreground">Recruiting partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle>Placement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="placed" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle>Sector-wise Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Recruiters */}
        <Card className="mt-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle>Top Recruiters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center">
              {topRecruiters.map((company) => (
                <div
                  key={company}
                  className="flex h-16 w-32 items-center justify-center rounded-lg border bg-card px-4 text-sm font-semibold transition-all hover:scale-105 hover:shadow-md"
                >
                  {company}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PlacementHighlights;
