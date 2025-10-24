# BMIET Chatbot

A simple FAQ chatbot that answers common questions about BMIET courses, admissions, placements, and campus life.

## Features

- **Floating Chat Icon**: Always accessible on all pages
- **Smart FAQ Matching**: Uses keyword matching and pattern recognition
- **Quick Questions**: Pre-defined quick question buttons
- **Minimal UI**: Clean, responsive design with Tailwind CSS
- **No External API**: All responses are predefined in JSON
- **Typing Animation**: Realistic chat experience with typing indicators

## FAQ Categories

The chatbot covers 14 categories:
- 📝 Admissions
- 📚 Courses  
- 💰 Fees
- 🎯 Placements
- 🎓 Scholarships
- 🏠 Accommodation
- 📞 Contact
- 📋 Eligibility
- 🏢 Facilities
- 📝 Examinations
- 📄 Documents
- 🏦 Loans
- 🚌 Transport
- 📖 Library

## How It Works

1. **Keyword Matching**: Matches user input against predefined keywords
2. **Pattern Recognition**: Uses regex patterns for common questions
3. **Fallback Responses**: Provides helpful responses when no match is found
4. **Context Awareness**: Remembers conversation context

## Usage

The chatbot is automatically available on all pages. Users can:
- Click the floating chat icon to open
- Type questions in natural language
- Use quick question buttons for common queries
- Minimize/close the chat window

## Adding New FAQs

To add new FAQ entries, edit `.frontend/src/data/faq.json`:

```json
{
  "id": 16,
  "keywords": ["new keyword", "related terms"],
  "question": "What is the new question?",
  "answer": "Detailed answer here.",
  "category": "category_name"
}
```

## Customization

- **Styling**: Modify the Tailwind classes in `Chatbot.tsx`
- **Responses**: Update the JSON data file
- **Quick Questions**: Modify the `quickQuestions` array
- **Greetings**: Update the `greetings` array in JSON
