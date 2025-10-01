export const MOCK_CONVERSATIONS = [
  { id: 1, title: "About Me", preview: "Tell me about yourself" },
  { id: 3, title: "Skills & Experience", preview: "What are your technical skills?" },
  { id: 4, title: "Contact Info", preview: "How can I get in touch?" },
];

export const PROJECTS_LIST = [
  { id: 1, name: "OYAPS Studio", url: "https://oyaps.com", description: "Tech studio and development team" },
  { id: 2, name: "Portfolio", url: "https://othman.oyaps.com", description: "Personal portfolio website" },
  { id: 3, name: "Sunway Kindergarten", url: "https://sunwayiq.com", description: "Educational platform" },
  { id: 4, name: "Simix Corporate", url: "https://simixiq.com", description: "Corporate website" },
  { id: 5, name: "AIOSH Learning", url: "https://aiosh.oyaps.com", description: "AI learning platform" },
  { id: 6, name: "Land of Franchise", url: "https://landoffranchise.iq", description: "Restaurant management" },
  { id: 7, name: "Nukhbat Ninawa", url: "https://nukhbatninawa.com", description: "Mobile app & website" },
  { id: 8, name: "NTU AI Chatbot", url: "#", description: "University AI assistant" },
  { id: 9, name: "Scopus Gate", url: "#", description: "Research publication system" },
  { id: 10, name: "Smart Scheduling", url: "#", description: "AI class scheduler" },
  { id: 11, name: "College Display", url: "#", description: "Real-time lecture system" },
  { id: 12, name: "NTU Exam System", url: "#", description: "Online exam platform" }
];

export const ADMIN_CREDENTIALS = {
  username: 'oth',
  password: 'asdddsaASD123'
};

export const FILE_SIZE_LIMITS = {
  PROFILE_PHOTO: 5 * 1024 * 1024, // 5MB
  LIBRARY_IMAGE: 10 * 1024 * 1024  // 10MB
};

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];