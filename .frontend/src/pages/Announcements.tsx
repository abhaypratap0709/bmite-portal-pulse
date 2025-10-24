import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Announcements from "@/components/Announcements";

const AnnouncementsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4">
          <Announcements />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnnouncementsPage;
