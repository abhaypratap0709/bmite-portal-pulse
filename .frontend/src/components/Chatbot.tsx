import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_URL = "http://localhost:5000/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface BotResponse {
  message: string;
  suggestions?: string[];
}

const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  
  // Initialize with translated greeting
  const getGreeting = () => ({
    id: "1",
    text: t("chatbot.greeting"),
    sender: "bot" as const,
    timestamp: new Date(),
  });
  
  const [messages, setMessages] = useState<Message[]>([getGreeting()]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update greeting when language changes
  useEffect(() => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      if (newMessages[0]?.id === "1") {
        newMessages[0] = getGreeting();
      }
      return newMessages;
    });
  }, [i18n.language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = async (userMessage: string): Promise<BotResponse> => {
    const lowerMessage = userMessage.toLowerCase();

    // Admission queries
    if (
      lowerMessage.includes("admission") ||
      lowerMessage.includes("apply") ||
      lowerMessage.includes("eligibility") ||
      lowerMessage.includes("entrance")
    ) {
      return {
        message: t("chatbot.admission"),
        suggestions: ["View courses", "Check fees", "Application status"],
      };
    }

    // Course queries
    if (
      lowerMessage.includes("course") ||
      lowerMessage.includes("program") ||
      lowerMessage.includes("branch") ||
      lowerMessage.includes("cse") ||
      lowerMessage.includes("computer science") ||
      lowerMessage.includes("mechanical") ||
      lowerMessage.includes("ece")
    ) {
      try {
        const response = await fetch(`${API_URL}/courses`);
        if (response.ok) {
          const data = await response.json();
          const courses = data.data;
          const courseList = courses
            .map((c: any) => `• ${c.name} (${c.code}) - ${c.seats.total} seats`)
            .join("\n");

          return {
            message:
              "🎓 **Available Courses:**\n\n" +
              courseList +
              "\n\nDuration: 4 years (8 semesters)\nAll programs are AICTE approved.",
            suggestions: ["Admission process", "Check fees", "Placement stats"],
          };
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }

      return {
        message:
          "🎓 Available Courses\n\n" +
          "Our Engineering Programs:\n" +
          "  • Computer Science Engineering (CSE)\n" +
          "  • Mechanical Engineering (MECH)\n" +
          "  • Electronics & Communication (ECE)\n" +
          "  • Civil Engineering (CIVIL)\n" +
          "  • Electrical Engineering (EE)\n\n" +
          "Duration: 4 years (8 semesters)\n" +
          "Recognition: AICTE approved\n" +
          "Outcome: Excellent placement records!",
        suggestions: ["Admission process", "Check fees", "Placement stats"],
      };
    }

    // Fee queries
    if (
      lowerMessage.includes("fee") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("tuition") ||
      lowerMessage.includes("price")
    ) {
      return {
        message: t("chatbot.fees"),
        suggestions: ["Admission process", "View courses", "Scholarships"],
      };
    }

    // Placement queries
    if (
      lowerMessage.includes("placement") ||
      lowerMessage.includes("job") ||
      lowerMessage.includes("recruit") ||
      lowerMessage.includes("salary") ||
      lowerMessage.includes("package")
    ) {
      try {
        const response = await fetch(`${API_URL}/placements/stats`);
        if (response.ok) {
          const data = await response.json();
          const stats = data.data;

          return {
            message:
              "🎯 **Placement Highlights:**\n\n" +
              `• **Placement Rate:** ${stats.placementPercentage}%\n` +
              `• **Highest Package:** ₹${(stats.highestPackage / 100000).toFixed(1)} LPA\n` +
              `• **Average Package:** ₹${(stats.averagePackage / 100000).toFixed(1)} LPA\n` +
              `• **Top Companies:** Google, Amazon, TCS, Infosys, Microsoft\n` +
              `• **Total Placements:** ${stats.totalPlacements}\n\n` +
              "Our placement cell provides comprehensive training and support!",
            suggestions: ["Top recruiters", "Training programs", "View courses"],
          };
        }
      } catch (err) {
        console.error("Failed to fetch placements:", err);
      }

      return {
        message: t("chatbot.placements"),
        suggestions: ["View courses", "Admission process", "Contact"],
      };
    }

    // Portal help
    if (
      lowerMessage.includes("portal") ||
      lowerMessage.includes("login") ||
      lowerMessage.includes("dashboard") ||
      lowerMessage.includes("how to use")
    ) {
      return {
        message:
          "🖥️ Portal Navigation Guide\n\n" +
          "For Students:\n" +
          "  1. Click 'Student Portal' in header\n" +
          "  2. Login with email & password\n" +
          "  3. Access grades, schedule & resources\n\n" +
          "For Admissions:\n" +
          "  1. Visit 'Admissions' page\n" +
          "  2. Fill application form\n" +
          "  3. Track status in Student Portal\n\n" +
          "Need Help?\n" +
          "Email: support@bmiet.edu.in",
        suggestions: ["Admission process", "Contact info", "View courses"],
      };
    }

    // Contact queries
    if (
      lowerMessage.includes("contact") ||
      lowerMessage.includes("phone") ||
      lowerMessage.includes("email") ||
      lowerMessage.includes("address") ||
      lowerMessage.includes("location")
    ) {
      return {
        message:
          "📞 Contact Information\n\n" +
          "Main Office:\n" +
          "  📧 info@bmiet.edu.in\n" +
          "  📱 +91 1234567890\n\n" +
          "Admissions:\n" +
          "  📧 admissions@bmiet.edu.in\n\n" +
          "Location:\n" +
          "  🏫 BMIET Campus\n" +
          "  Education District, City\n\n" +
          "Timing: Mon-Sat, 9 AM - 5 PM\n\n" +
          "Visit campus or take a virtual tour!",
        suggestions: ["Virtual tour", "Admission process", "View courses"],
      };
    }

    // Scholarship queries
    if (
      lowerMessage.includes("scholarship") ||
      lowerMessage.includes("financial aid") ||
      lowerMessage.includes("discount")
    ) {
      return {
        message:
          "🎓 Scholarships & Financial Aid\n\n" +
          "Merit-Based:\n" +
          "  • Up to 50% tuition waiver\n" +
          "  • For academic excellence\n\n" +
          "Special Categories:\n" +
          "  • Sports quota for athletes\n" +
          "  • Need-based assistance\n" +
          "  • SC/ST/OBC government schemes\n\n" +
          "Education Loans:\n" +
          "  • Bank loan processing help\n" +
          "  • Flexible repayment options\n\n" +
          "Contact: admissions@bmiet.edu.in",
        suggestions: ["Admission process", "Check fees", "Eligibility"],
      };
    }

    // Facilities queries
    if (
      lowerMessage.includes("facility") ||
      lowerMessage.includes("hostel") ||
      lowerMessage.includes("library") ||
      lowerMessage.includes("lab") ||
      lowerMessage.includes("infrastructure")
    ) {
      return {
        message:
          "🏢 Campus Facilities\n\n" +
          "Academic:\n" +
          "  • Modern labs (AI/ML, IoT, Robotics)\n" +
          "  • 50,000+ books library\n" +
          "  • Digital learning resources\n\n" +
          "Residential:\n" +
          "  • Separate hostels (boys & girls)\n" +
          "  • Hygienic mess facilities\n\n" +
          "Recreation:\n" +
          "  • Sports courts (Cricket, Football)\n" +
          "  • Indoor games facilities\n\n" +
          "Other:\n" +
          "  • High-speed WiFi campus\n" +
          "  • Bus transport from major areas\n\n" +
          "Schedule a campus visit!",
        suggestions: ["Virtual tour", "Admission process", "Contact"],
      };
    }

    // Default response
    return {
      message:
        "I'm here to help! Ask me about:\n\n" +
        "📚 Courses & Programs\n" +
        "📝 Admission Process\n" +
        "💰 Fees & Scholarships\n" +
        "🎯 Placement Statistics\n" +
        "🏢 Campus Facilities\n" +
        "📞 Contact Information\n" +
        "🖥️ Portal Navigation\n\n" +
        "What would you like to know?",
      suggestions: ["View courses", "Admission process", "Placement stats", "Contact"],
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const botResponse = await getBotResponse(inputValue);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.message,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Add suggestion chips if available
      if (botResponse.suggestions) {
        // We'll just show them in the UI, user can click to use them
      }
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6 mx-auto" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-2xl flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg">BMIET Assistant</CardTitle>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-gray-300">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg p-3 whitespace-pre-line ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                  {message.sender === "user" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;

