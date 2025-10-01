import { useState, useEffect, useRef } from 'react';
import './App.css';
import AdminPanel from './components/admin/AdminPanel';
import AdminLogin from './components/admin/AdminLogin';
import { useAuth } from '../hooks/useAuth';

// ==================== CONSTANTS ====================
const MOCK_CONVERSATIONS = [
  { id: 1, title: "About Me", preview: "Tell me about yourself" },
  { id: 3, title: "Skills & Experience", preview: "What are your technical skills?" },
  { id: 4, title: "Contact Info", preview: "How can I get in touch?" },
];

const MOCK_MESSAGES = {
  1: [ 
    { 
      role: 'user', 
      content: "Tell me about yourself" 
    },
    { 
      role: 'assistant', 
      content: "Hi! I'm **Othman Yehia Hamed** from Mosul, Iraq. Born on May 26, 2005, I'm a cybersecurity and AI engineering student at Northern Technical University with a passion for full-stack development and offensive security.\n\n**Professional Summary**\nI'm the founder of OYAPS Studio and organizer of Ashur CTF 2025, the largest cybersecurity competition in Nineveh governorate. I have a proven record of building real-world platforms and leading tech teams. I'm passionate about advancing the tech scene in Mosul and Iraq through community training and innovation.\n\n**Current Focus**\n• Cybersecurity and AI engineering studies\n• Leading OYAPS Studio development team\n• Organizing cybersecurity competitions\n• Building production systems for local businesses\n• Advancing Iraq's tech community\n\n**Education**\nB.Sc. in Cybersecurity and Cloud Computing Engineering\nNorthern Technical University – College of Computer Engineering & Artificial Intelligence\nExpected Graduation: 2027 – 2028" 
    }
  ],
  3: [ 
    { 
      role: 'user', 
      content: "What are your technical skills?" 
    },
    { 
      role: 'assistant', 
      content: "Here are my core technical skills:\n\n**💻 Programming & Frameworks**\n• Next.js, Node.js, React, React Native\n• Python, C++, Prisma\n• Full-stack web development and mobile app\n\n**🗄️ Databases**\n• PostgreSQL, MySQL, MongoDB\n• Database design and optimization\n\n**🔐 Cybersecurity**\n• Penetration testing and vulnerability assessment\n• Red-team operations\n• eJPT Certification (eLearnSecurity Junior Penetration Tester)\n\n**🤖 AI & Machine Learning**\n• LLM fine-tuning and customization\n• Machine learning pipelines\n• AI-driven web applications\n\n**🛠️ Tools & Platforms**\n• Docker containerization\n• Linux (Arch, Kali)\n• Git version control\n• Cloud deployment and DevOps\n\n**🏆 Competition Achievements**\n• AI Competition Finalist, Cihan University\n• SulyCyberCon 2023 – 8th place nationwide\n• Iraq Ministry of Interior Cybersecurity Competition – National finalist\n• Digital Shortcut Hackathon (Asiacell) – 3rd place\n\n**🌐 Languages**\n• Arabic: Native\n• English: Good/Working proficiency" 
    }
  ],
  4: [ 
    { 
      role: 'user', 
      content: "How can I get in touch?" 
    },
    { 
      role: 'assistant', 
      content: "Feel free to reach out through any of these channels:\n\n**📧 Email**\n• [othman@oyaps.com](mailto:othman@oyaps.com)\n• [othman.yahya@ntu.edu.iq](mailto:othman.yahya@ntu.edu.iq)\n• For professional inquiries and collaborations\n\n**📱 Phone**\n• [+964 776 515 5920](tel:+9647765155920)\n• Available for calls and WhatsApp\n\n**💼 Professional Networks**\n• LinkedIn: [othman-yehia-b37890377](https://linkedin.com/in/othman-yehia-b37890377)\n• Portfolio: [othman.oyaps.com](https://othman.oyaps.com)\n\n**📱 Social Media**\n• Instagram: [@oth_ya](https://www.instagram.com/oth_ya?igsh=MXJpZ3gweTZicTBtYw%3D%3D&utm_source=qr)\n• OYAPS Channel: [OYAPS_iq](https://t.me/OYAPS_iq)\n\n**📍 Location**\n• Based in Mosul, Iraq\n• Available for remote work and local projects\n\n**💬 Let's Connect!**\nI'm always interested in:\n• Cybersecurity collaboration opportunities\n• AI and machine learning projects\n• Full-stack development work\n• Tech community building in Iraq\n• Mentoring and knowledge sharing\n• Competition partnerships and CTF teams\n\nDon't hesitate to reach out if you want to discuss technology, explore collaborations, or learn more about the growing tech scene in Mosul!" 
    }
  ]
};

const PROJECTS_LIST = [
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

// ==================== ICON COMPONENTS ====================
const Icons = {
  Plus: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Send: () => (
    <img src="/send-alt-1-svgrepo-com.svg" alt="Send" width="16" height="16" style={{ filter: 'brightness(0) invert(1)' }} />
  ),
  Close: () => (
    <img src="/exit-icon.svg" alt="Close" width="36" height="36" style={{ filter: 'brightness(0) invert(1)' }} />
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 21L16.514 16.506L21 21ZM19 10.5A8.5 8.5 0 1 1 10.5 2A8.5 8.5 0 0 1 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Library: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  GPT: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V7H16.5A2.5 2.5 0 0 1 19 9.5A2.5 2.5 0 0 1 16.5 12H12V16.5A2.5 2.5 0 0 1 9.5 19A2.5 2.5 0 0 1 7 16.5V12H2.5A2.5 2.5 0 0 1 0 9.5A2.5 2.5 0 0 1 2.5 7H7V2.5A2.5 2.5 0 0 1 9.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Menu: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Logo: () => (
    <img src="/othman-logo.svg" alt="Othman's GPT" width="32" height="32" style={{ filter: 'brightness(0) invert(1)' }} />
  )
};

// ==================== UTILITY FUNCTIONS ====================
const formatMessageContent = (content) => {
  return content.split('\n').map((line, i) => {
    let formattedLine = line;
    // Bold text
    formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Links
    formattedLine = formattedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
  });
};

// ==================== CUSTOM HOOKS ====================
const useResponsiveSidebar = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return [collapsed, setCollapsed];
};

// ==================== HEADER COMPONENT ====================
const Header = ({ onToggleSidebar, onProfileClick, title = "Othman's GPT" }) => (
  <div className="chat-header" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
    <div className="header-main">
      <div className="header-left">
        <button className="collapse-btn" onClick={onToggleSidebar}>
          <Icons.Menu />
        </button>
      </div>
      <div className="header-center">
        <div className="chat-title-container">
          <Icons.Logo />
          <h1>{title}</h1>
        </div>
      </div>
      <div className="header-right">
        <button className="profile-btn" onClick={onProfileClick}>
          <div className="avatar-small">
            <img src="/profile-photo.jpg" alt="Othman Yehia" />
          </div>
        </button>
      </div>
    </div>
  </div>
);

// ==================== SIDEBAR COMPONENT ====================
const Sidebar = ({ onLibraryClick, onChatClick, currentView, selectedChat, onChatSelect, onProfileClick, onGPTClick, onAdminClick }) => (
  <div className="sidebar" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
    <div className="sidebar-header">
      <button className="new-chat-btn" onClick={onChatClick}>
        <Icons.Plus />
        New chat
      </button>
    </div>
    
    <div className="sidebar-content">
      <div className="sidebar-menu">
        <div className="menu-item">
          <Icons.Search />
          <span>Search chats</span>
        </div>
        <div className={`menu-item ${currentView === 'library' ? 'active' : ''}`} onClick={onLibraryClick}>
          <Icons.Library />
          <span>Library</span>
        </div>
        <div className={`menu-item ${currentView === 'gpts' ? 'active' : ''}`} onClick={onGPTClick}>
          <Icons.GPT />
          <span>GPTs</span>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      <div className="projects-section">
        <div className="section-title">Projects</div>
        <div className="projects-list">
          {PROJECTS_LIST.map(project => (
            <div key={project.id} className="project-item">
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
                <span className="project-name">{project.name}</span>
                <span className="project-description">{project.description}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-divider"></div>

      <div className="chat-history">
        <div className="chat-history-section">
          <div className="section-title">Chats</div>
          {MOCK_CONVERSATIONS.map(conv => (
            <div key={conv.id} className={`chat-item ${selectedChat === conv.id ? 'active' : ''}`} onClick={() => onChatSelect(conv.id)}>
              <span className="chat-title">{conv.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="sidebar-footer">
      <div 
        className="user-profile" 
        onClick={(e) => {
          if (e.shiftKey) {
            onAdminClick();
          } else {
            onProfileClick();
          }
        }} 
        title="Shift+Click for admin access"
      >
        <div className="avatar">
          <img src="/profile-photo.jpg" alt="Othman Yehia" />
        </div>
        <div className="user-info">
          <span className="user-name">Othman Yehia</span>
          <span className="user-status">Plus</span>
        </div>
      </div>
    </div>
  </div>
);

// ==================== CHAT AREA COMPONENT ====================
const ChatArea = ({ selectedChat, onToggleSidebar, onProfileClick }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES[selectedChat] || []);
  const [showWelcome, setShowWelcome] = useState(messages.length === 0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(MOCK_MESSAGES[selectedChat] || []);
    setShowWelcome((MOCK_MESSAGES[selectedChat] || []).length === 0);
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue };
    const botResponse = { role: 'assistant', content: "dude it's just a portfolio🤖" };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputValue('');
    setShowWelcome(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-area">
      <Header onToggleSidebar={onToggleSidebar} onProfileClick={onProfileClick} />
      <div className="chat-messages">
        {showWelcome ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <Icons.Logo />
              <h2>How can I help you today?</h2>
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">
                  {message.role === 'assistant' && (
                    <div className="message-avatar"><Icons.Logo /></div>
                  )}
                  <div className="message-text">{formatMessageContent(message.content)}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-form">
          <div className="input-wrapper">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Othman's GPT"
              rows="1"
              className="chat-input"
            />
            <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
              <Icons.Send />
            </button>
          </div>
        </form>
        <div className="input-footer">
          Othman's GPT can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

// ==================== PROFILE MODAL ====================
const ProfileModal = ({ onClose }) => (
  <div className="profile-modal" onClick={onClose}>
    <div className="profile-modal-overlay"></div>
    <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-profile-modal" onClick={onClose}>
        <Icons.Close />
      </button>
      <div className="profile-header">
        <div className="profile-photo">
          <img src="/profile-photo.jpg" alt="Othman Yehia" />
        </div>
        <div className="profile-info">
          <h2>Othman Yehia Hamed</h2>
          <p className="profile-title">Cybersecurity & AI Engineering Student</p>
          <p className="profile-location">📍 Mosul, Iraq</p>
        </div>
      </div>
      <div className="profile-details">
        <div className="profile-section">
          <h3>About</h3>
          <p>Born on May 26, 2005, I'm a cybersecurity and AI engineering student at Northern Technical University. I'm the founder of OYAPS Studio and organizer of Ashur CTF 2025, passionate about advancing the tech scene in Mosul and Iraq through innovation and community building.</p>
        </div>
        <div className="profile-section">
          <h3>Contact</h3>
          <div className="contact-links">
            <a href="mailto:othman.yehiaa@gmail.com" className="contact-link">📧 othman.yehiaa@gmail.com</a>
            <a href="tel:+964776515920" className="contact-link">📱 +964 776 515 5920</a>
            <a href="https://linkedin.com/in/othman-yehia-b37890377" target="_blank" rel="noopener noreferrer" className="contact-link">💼 LinkedIn Profile</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==================== GPTS PAGE COMPONENT ====================
const GPTsPage = ({ onToggleSidebar, onProfileClick }) => {
  const [gptProfiles, setGptProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGPTProfiles();
  }, []);

  const loadGPTProfiles = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading GPT profiles from Appwrite...');
      
      // Import the service properly
      const appwriteService = (await import('./services/appwriteService')).default;
      const profiles = await appwriteService.getAllGPTProfiles();
      console.log(`✅ Loaded ${profiles.length} GPT profiles`);
      
      setGptProfiles(profiles.map(p => ({
        id: p.$id,
        name: p.name,
        description: p.description,
        photo: p.photo,
        specialties: p.specialties || []
      })));
      
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error loading GPT profiles:', err);
      
      // Fallback to mock data if Appwrite fails
      console.log('🔄 Falling back to mock data...');
      const mockProfiles = [
        {
          id: 'mock-1',
          name: "Othman Yehia",
          description: "Cybersecurity expert and AI engineering student. Specializes in penetration testing, CTF competitions, and building secure applications.",
          photo: "/profile-photo.jpg"
        },
        {
          id: 'mock-2',
          name: "OYAPS Studio AI",
          description: "AI assistant for OYAPS Studio projects. Helps with full-stack development, project planning, and technical documentation.",
          photo: "/gpt-profiles/default-avatar.svg"
        },
        {
          id: 'mock-3',
          name: "Security Analyst",
          description: "Expert in vulnerability assessment, threat analysis, and cybersecurity best practices. Perfect for security audits and compliance.",
          photo: "/gpt-profiles/default-avatar.svg"
        }
      ];
      setGptProfiles(mockProfiles);
      setError('Using offline data - Connect to internet for latest profiles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-area">
      <Header onToggleSidebar={onToggleSidebar} onProfileClick={onProfileClick} title="GPTs" />
      
      <div className="gpt-library-page">
        <div className="library-header">
          <div className="library-icon">
            <Icons.GPT />
          </div>
          <h1>GPT Profiles</h1>
          <p>Specialized AI assistants for different domains and expertise areas</p>
        </div>

        <div className="gpt-intro-message">
          <p>These are specialized GPT profiles, each tailored for specific domains and expertise areas.</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading GPT profiles...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : null}

        <div className="gpt-gallery">
          {gptProfiles.map((profile) => (
            <div key={profile.id} className="gpt-profile-card">
              <div className="gpt-avatar">
                <img 
                  src={profile.photo} 
                  alt={profile.name}
                  onError={(e) => e.target.src = '/gpt-profiles/default-avatar.svg'}
                />
              </div>
              <div className="gpt-info">
                <h3 className="gpt-name">{profile.name}</h3>
                <p className="gpt-description">{profile.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Replace the existing LibraryPage component with this updated version

// ==================== LIBRARY PAGE COMPONENT ====================
const LibraryPage = ({ onToggleSidebar, onProfileClick }) => {
  const [libraryImages, setLibraryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLibraryImages();
  }, []);

  const loadLibraryImages = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading library images from Appwrite...');
      
      // Import the service properly
      const appwriteService = (await import('./services/appwriteService')).default;
      const images = await appwriteService.getAllLibraryImages();
      console.log(`✅ Loaded ${images.length} library images`);
      
      setLibraryImages(images.map(img => ({
        id: img.$id,
        src: img.src,
        alt: img.alt
      })));
      
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error loading library images:', err);
      
      // Fallback to mock data if Appwrite fails
      console.log('🔄 Falling back to mock data...');
      const mockImages = [
        { id: 'mock-1', src: "/library/2025-09-16 06.41.46.jpg", alt: "OYAPS Studio workspace" },
        { id: 'mock-2', src: "/library/2025-09-16 06.42.22.jpg", alt: "Cybersecurity lab setup" },
        { id: 'mock-3', src: "/library/2025-09-16 06.42.35.jpg", alt: "Programming session" },
        { id: 'mock-4', src: "/library/2025-09-16 06.42.45.jpg", alt: "Team collaboration" },
        { id: 'mock-5', src: "/library/2025-09-16 06.42.52.jpg", alt: "Project presentation" },
        { id: 'mock-6', src: "/library/2025-09-16 06.42.59.jpg", alt: "AI research work" },
        { id: 'mock-7', src: "/library/2025-09-16 06.43.06.jpg", alt: "CTF competition" },
        { id: 'mock-8', src: "/library/2025-09-16 06.43.12.jpg", alt: "University project" }
      ];
      setLibraryImages(mockImages);
      setError('Using offline data - Connect to internet for latest photos');
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="chat-area">
      <Header onToggleSidebar={onToggleSidebar} onProfileClick={onProfileClick} title="Library" />
      
      <div className="library-page">
        <div className="library-header">
          <div className="library-icon">
            <Icons.Library />
          </div>
          <h1>Photo Library</h1>
          <p>Visual portfolio showcasing projects, achievements, and behind-the-scenes moments</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading library...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : null}

        <div className="library-gallery">
          {libraryImages.map((image) => (
            <div 
              key={image.id} 
              className="library-item"
              onClick={() => openImageModal(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                onError={(e) => {
                  e.target.src = '/gpt-profiles/default-avatar.svg';
                }}
              />
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="image-modal" onClick={closeImageModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeImageModal}>
                <Icons.Close />
              </button>
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <div className="modal-info">
                <h3>{selectedImage.alt}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
export default function App() {
  const [currentView, setCurrentView] = useState('chat');
  const [selectedChat, setSelectedChat] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useResponsiveSidebar();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const { 
    isAuthenticated, 
    user: _user, 
    error: authError, 
    loading: authLoading, 
    loginLoading, 
    login, 
    register, 
    logout 
  } = useAuth();

  // Fix mobile scroll by preventing body scroll
  useEffect(() => {
    if (currentView === 'chat' || currentView === 'gpts' || currentView === 'library') {
      document.body.classList.add('chat-active');
    } else {
      document.body.classList.remove('chat-active');
    }

    return () => {
      document.body.classList.remove('chat-active');
    };
  }, [currentView]);

  // Check for admin route on mount
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (path === '/admin' || hash === '#admin') {
      setCurrentView('admin-login');
    }
  }, []);

  // Handle admin login
  const handleAdminLogin = async (email, password) => {
    const success = await login(email, password);
    if (success) {
      setCurrentView('admin');
    }
    return success;
  };

  // Handle admin registration
  const handleAdminRegister = async (email, password, name) => {
    const success = await register(email, password, name);
    if (success) {
      setCurrentView('admin');
    }
    return success;
  };

  // Handle admin logout
  const handleAdminLogout = async () => {
    await logout();
    setCurrentView('chat');
  };

  const renderCurrentView = () => {
    // Show loading spinner while checking auth status
    if (authLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'chat':
        return (
          <ChatArea 
            selectedChat={selectedChat} 
            onToggleSidebar={() => setSidebarCollapsed(prev => !prev)} 
            onProfileClick={() => setShowProfileModal(true)} 
          />
        );
      
      case 'gpts':
        return (
          <GPTsPage 
            onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
            onProfileClick={() => setShowProfileModal(true)}
          />
        );
      
      case 'library':
        return (
          <LibraryPage 
            onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
            onProfileClick={() => setShowProfileModal(true)}
          />
        );
      
      case 'admin':
        // Check if user is authenticated for admin access
        if (!isAuthenticated) {
          setCurrentView('admin-login');
          return null;
        }
        return (
          <AdminPanel 
            onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
            onProfileClick={() => setShowProfileModal(true)}
            onAdminLogout={handleAdminLogout}
          />
        );
      
      case 'admin-login':
        if (isAuthenticated) {
          setCurrentView('admin');
          return null;
        }
        
        if (authMode === 'register') {
          return (
            <AdminRegister
              onRegister={handleAdminRegister}
              onSwitchToLogin={() => setAuthMode('login')}
              error={authError}
              loading={loginLoading}
            />
          );
        }
        
        return (
          <AdminLogin 
            onLogin={handleAdminLogin}
            onSwitchToRegister={() => setAuthMode('register')}
            error={authError}
            loading={loginLoading}
          />
        );
      
      default:
        return (
          <ChatArea 
            selectedChat={selectedChat} 
            onToggleSidebar={() => setSidebarCollapsed(prev => !prev)} 
            onProfileClick={() => setShowProfileModal(true)} 
          />
        );
    }
  };

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {!sidebarCollapsed && currentView !== 'admin' && currentView !== 'admin-login' && (
        <div className="sidebar-overlay" onClick={() => setSidebarCollapsed(true)} />
      )}
      
      {currentView !== 'admin' && currentView !== 'admin-login' && (
        <Sidebar 
          onLibraryClick={() => setCurrentView('library')}
          onChatClick={() => setCurrentView('chat')}
          onGPTClick={() => setCurrentView('gpts')}
          onAdminClick={() => setCurrentView('admin-login')}
          currentView={currentView}
          selectedChat={selectedChat}
          onChatSelect={(id) => {
            setSelectedChat(id);
            setCurrentView('chat');
          }}
          onProfileClick={() => setShowProfileModal(true)}
        />
      )}
      
      {renderCurrentView()}
      
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </div>
  );
}