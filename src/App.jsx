import { useState, useEffect, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './App.css';

const mockConversations = [
  { id: 1, title: "About Me", preview: "Tell me about yourself" },
  { id: 3, title: "Skills & Experience", preview: "What are your technical skills?" },
  { id: 4, title: "Contact Info", preview: "How can I get in touch?" },
];

const mockMessages = {
  1: [ // About Me conversation
    { 
      role: 'user', 
      content: "Tell me about yourself" 
    },
    { 
      role: 'assistant', 
      content: "Hi! I'm **Othman Yehia Hamed** from Mosul, Iraq. Born on May 26, 2005, I'm a cybersecurity and AI engineering student at Northern Technical University with a passion for full-stack development and offensive security.\n\n**Professional Summary**\nI'm the founder of OYAPS Studio and organizer of Ashur CTF 2025, the largest cybersecurity competition in Nineveh governorate. I have a proven record of building real-world platforms and leading tech teams. I'm passionate about advancing the tech scene in Mosul and Iraq through community training and innovation.\n\n**Current Focus**\n• Cybersecurity and AI engineering studies\n• Leading OYAPS Studio development team\n• Organizing cybersecurity competitions\n• Building production systems for local businesses\n• Advancing Iraq's tech community\n\n**Education**\nB.Sc. in Cybersecurity and Cloud Computing Engineering\nNorthern Technical University – College of Computer Engineering & Artificial Intelligence\nExpected Graduation: 2027 – 2028" 
    }
  ],
  3: [ // Skills & Experience conversation
    { 
      role: 'user', 
      content: "What are your technical skills?" 
    },
    { 
      role: 'assistant', 
      content: "Here are my core technical skills:\n\n**💻 Programming & Frameworks**\n• Next.js, Node.js, React, React Native\n• Python, C++, Prisma\n• Full-stack web development and mobile app\n\n**🗄️ Databases**\n• PostgreSQL, MySQL, MongoDB\n• Database design and optimization\n\n**🔐 Cybersecurity**\n• Penetration testing and vulnerability assessment\n• Red-team operations\n• eJPT Certification (eLearnSecurity Junior Penetration Tester)\n\n**🤖 AI & Machine Learning**\n• LLM fine-tuning and customization\n• Machine learning pipelines\n• AI-driven web applications\n\n**🛠️ Tools & Platforms**\n• Docker containerization\n• Linux (Arch, Kali)\n• Git version control\n• Cloud deployment and DevOps\n\n**🏆 Competition Achievements**\n• AI Competition Finalist, Cihan University\n• SulyCyberCon 2023 – 8th place nationwide\n• Iraq Ministry of Interior Cybersecurity Competition – National finalist\n• Digital Shortcut Hackathon (Asiacell) – 3rd place\n\n**🌐 Languages**\n• Arabic: Native\n• English: Good/Working proficiency" 
    }
  ],
  4: [ // Contact Info conversation
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

// Library images (your personal photos) - now without numbering
const initialLibraryImages = [
  { id: 1, src: "/library/2025-09-16 06.41.46.jpg", alt: "Personal Photo" },
  { id: 2, src: "/library/2025-09-16 06.42.35.jpg", alt: "Personal Photo" },
  { id: 3, src: "/library/2025-09-16 06.42.52.jpg", alt: "Personal Photo" },
  { id: 4, src: "/library/2025-09-16 06.42.59.jpg", alt: "Personal Photo" },
  { id: 5, src: "/library/2025-09-16 06.43.06.jpg", alt: "Personal Photo" },
  { id: 6, src: "/library/2025-09-16 06.43.12.jpg", alt: "Personal Photo" },
  { id: 7, src: "/library/2025-09-16 06.43.23.jpg", alt: "Personal Photo" },
  { id: 8, src: "/library/2025-09-16 06.43.39.jpg", alt: "Personal Photo" },
  { id: 9, src: "/library/2025-09-16 06.43.45.jpg", alt: "Personal Photo" },
  { id: 10, src: "/library/2025-09-16 06.43.57.jpg", alt: "Personal Photo" }
];

// Your projects list
const projectsList = [
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

// GPT profiles data
const initialGPTProfiles = [
  { 
    id: 1, 
    name: "Dr. Sarah Chen", 
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=800&h=800&fit=crop&crop=face&auto=format&q=90", 
    description: "AI Research Specialist with expertise in machine learning and neural networks. Passionate about advancing AI education and developing ethical AI solutions.",
    specialties: ["Machine Learning", "Neural Networks", "AI Ethics"]
  },
  { 
    id: 2, 
    name: "Ahmed Hassan", 
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face&auto=format&q=90", 
    description: "Cybersecurity expert with 8+ years in penetration testing and red team operations. CTF champion and security consultant.",
    specialties: ["Penetration Testing", "Red Team", "CTF"]
  },
  { 
    id: 3, 
    name: "Maria Rodriguez", 
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop&crop=face&auto=format&q=90", 
    description: "Full-stack developer specializing in React, Node.js, and cloud architecture. Open source contributor and tech speaker.",
    specialties: ["React", "Node.js", "Cloud Architecture"]
  },
  { 
    id: 4, 
    name: "David Kim", 
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop&crop=face&auto=format&q=90", 
    description: "Data scientist with expertise in Python, machine learning, and big data analytics. Research publication author and AI consultant.",
    specialties: ["Python", "Data Science", "Big Data"]
  },
  { 
    id: 5, 
    name: "Othman's Life GPT", 
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&h=800&fit=crop&crop=face&auto=format&q=90", 
    description: "This GPT holds the important moments and people in Othman's GPT life.",
    specialties: ["Life Stories", "Personal Moments", "Memories"]
  }
];

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <img 
      src="/send-alt-1-svgrepo-com.svg" 
      alt="Send" 
      width="16" 
      height="16" 
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
}

function CloseIcon() {
  return (
    <img 
      src="/exit-icon.svg" 
      alt="Close" 
      width="36" 
      height="36" 
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 21L16.514 16.506L21 21ZM19 10.5A8.5 8.5 0 1 1 10.5 2A8.5 8.5 0 0 1 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SoraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GPTIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V7H16.5A2.5 2.5 0 0 1 19 9.5A2.5 2.5 0 0 1 16.5 12H12V16.5A2.5 2.5 0 0 1 9.5 19A2.5 2.5 0 0 1 7 16.5V12H2.5A2.5 2.5 0 0 1 0 9.5A2.5 2.5 0 0 1 2.5 7H7V2.5A2.5 2.5 0 0 1 9.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M2 3H8A2 2 0 0 1 10 5V19A2 2 0 0 1 8 21H2A2 2 0 0 1 0 19V5A2 2 0 0 1 2 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3H22A2 2 0 0 1 24 5V19A2 2 0 0 1 22 21H16A2 2 0 0 1 14 19V5A2 2 0 0 1 16 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function OthmanLogo() {
  return (
    <img 
      src="/othman-logo.svg" 
      alt="Othman's GPT" 
      width="32" 
      height="32" 
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
}

// Image Crop Editor Component
function ImageCropEditor({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({
    unit: 'px',
    width: 200,
    height: 200,
    x: 50,
    y: 50,
    aspect: 1
  });
  const imgRef = useRef(null);

  const getCroppedImg = () => {
    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    
    if (!image || !crop.width || !crop.height) {
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio || 1;

    // Ensure crop values are numbers
    const cropX = crop.x || 0;
    const cropY = crop.y || 0;
    const cropWidth = crop.width || 80;
    const cropHeight = crop.height || 80;

    canvas.width = cropWidth * scaleX * pixelRatio;
    canvas.height = cropHeight * scaleY * pixelRatio;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      cropX * scaleX,
      cropY * scaleY,
      cropWidth * scaleX,
      cropHeight * scaleY,
      0,
      0,
      cropWidth * scaleX,
      cropHeight * scaleY
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const croppedImageUrl = URL.createObjectURL(blob);
          resolve(croppedImageUrl);
        },
        'image/jpeg',
        0.9
      );
    });
  };

  const handleCropComplete = async () => {
    try {
      const croppedImageUrl = await getCroppedImg();
      if (croppedImageUrl) {
        onCropComplete(croppedImageUrl);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <div className="image-crop-modal">
      <div className="image-crop-overlay" onClick={onCancel}></div>
      <div className="image-crop-content">
        <div className="image-crop-header">
          <h3>Crop Image</h3>
          <button className="close-crop-modal" onClick={onCancel}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="image-crop-container">
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => {
              if (newCrop && typeof newCrop === 'object') {
                setCrop(newCrop);
              }
            }}
            onComplete={(completedCrop) => {
              if (completedCrop && typeof completedCrop === 'object') {
                setCrop(completedCrop);
              }
            }}
            aspect={1}
            circularCrop={true}
            minWidth={50}
            minHeight={50}
          >
            <img 
              ref={imgRef}
              src={imageSrc} 
              alt="Crop preview"
              style={{ maxHeight: '400px', maxWidth: '100%' }}
              onLoad={() => {
                // Ensure crop is set after image loads
                if (imgRef.current) {
                  const { width, height } = imgRef.current;
                  const size = Math.min(width, height) * 0.8;
                  setCrop({
                    unit: 'px',
                    width: size,
                    height: size,
                    x: (width - size) / 2,
                    y: (height - size) / 2,
                    aspect: 1
                  });
                }
              }}
            />
          </ReactCrop>
        </div>

        <div className="image-crop-actions">
          <button className="crop-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="crop-confirm-btn" onClick={handleCropComplete}>
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
}

function UpgradeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Library({ selectedImage, onImageSelect, onImageClose, onToggleSidebar, onProfileClick, libraryImages }) {
  return (
    <div className="chat-area"> {/* Use same container as chat */}
      <div className="chat-header">
        <div className="header-main">
          <div className="header-left">
            <button className="collapse-btn" onClick={onToggleSidebar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="header-center">
            <div className="chat-title-container">
              <OthmanLogo />
              <h1>Othman's GPT</h1>
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
      
      <div className="library-page">
        <div className="library-header">
          <div className="library-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>Photo Gallery</h1>
        </div>
        
        <div className="library-gallery">
          {libraryImages.map((image) => (
            <div 
              key={image.id} 
              className="library-item"
              onClick={() => onImageSelect(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.log(`Failed to load image: ${image.src}`);
                }}
                onLoad={() => {
                  console.log(`Successfully loaded image: ${image.src}`);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={onImageClose}>
          <div className="modal-overlay"></div>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={onImageClose}>
              <CloseIcon />
            </button>
            <div className="modal-image-container">
              <img src={selectedImage.src} alt={selectedImage.alt} />
            </div>
            <div className="modal-info">
              <h3>{selectedImage.alt}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// GPT Library Component
function GPTLibrary({ onToggleSidebar, onProfileClick, gptProfiles, onGPTSelect }) {
  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="header-main">
          <div className="header-left">
            <button className="collapse-btn" onClick={onToggleSidebar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="header-center">
            <div className="chat-title-container">
              <OthmanLogo />
              <h1>Othman's GPT</h1>
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
      
      <div className="gpt-intro-message">
        <p>This GPT holds the important moments and people in Othman's GPT life.</p>
      </div>
      
      <div className="gpt-gallery">
        {gptProfiles.map((profile) => (
          <div 
            key={profile.id} 
            className="gpt-profile-card"
            onClick={() => onGPTSelect(profile)}
          >
            <div className="gpt-avatar">
              <img 
                src={profile.photo} 
                alt={profile.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="avatar-initials-square">${profile.name.split(' ').map(n => n[0]).join('')}</div>`;
                }}
              />
            </div>
            <div className="gpt-info">
              <h3 className="gpt-name">{profile.name}</h3>
              <p className="gpt-description">
                {(profile.description || '').trim() || 'No description available'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Login Component
function AdminLogin({ onAdminLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Updated authentication credentials
    if (credentials.username === 'oth' && credentials.password === 'asdddsaASD123') {
      onAdminLogin();
    } else {
      setError('Bro really? I am a cybersecurity man 🔒');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <OthmanLogo />
          <h1>Admin Login</h1>
          <p>Enter your credentials to manage GPT profiles</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Sign In
          </button>
        </form>
        
        <div className="admin-login-footer">
          <small style={{ color: '#6b7280', fontSize: '12px' }}>Demo credentials: admin / password123</small>
        </div>
      </div>
    </div>
  );
}

// Updated Admin Component with simplified form and edit/delete functionality
function AdminPanel({ onToggleSidebar, onProfileClick, gptProfiles, onAddGPT, onEditGPT, onDeleteGPT, onAdminLogout, libraryImages, onAddLibraryImage, onDeleteLibraryImage }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photo: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [originalPhoto, setOriginalPhoto] = useState(''); // Track original photo when editing
  const [activeTab, setActiveTab] = useState('gpts'); // 'gpts' or 'library'
  const [libraryPhoto, setLibraryPhoto] = useState(null);
  const [libraryPreviewUrl, setLibraryPreviewUrl] = useState('');
  
  // Image crop editor states
  const [showCropEditor, setShowCropEditor] = useState(false);
  const [originalImageForCrop, setOriginalImageForCrop] = useState('');
  const [showLibraryCropEditor, setShowLibraryCropEditor] = useState(false);
  const [originalLibraryImageForCrop, setOriginalLibraryImageForCrop] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      // Create URL for crop editor
      const url = URL.createObjectURL(file);
      setOriginalImageForCrop(url);
      setShowCropEditor(true);
    }
  };

  const handleCropComplete = (croppedImageUrl) => {
    setPreviewUrl(croppedImageUrl);
    setShowCropEditor(false);
    setOriginalImageForCrop('');
  };

  const handleCropCancel = () => {
    setShowCropEditor(false);
    setOriginalImageForCrop('');
    // Reset file input
    const fileInput = document.getElementById('photo');
    if (fileInput) fileInput.value = '';
    setFormData(prev => ({ ...prev, photo: null }));
  };

  const handleLibraryCropComplete = (croppedImageUrl) => {
    setLibraryPreviewUrl(croppedImageUrl);
    setShowLibraryCropEditor(false);
    setOriginalLibraryImageForCrop('');
  };

  const handleLibraryCropCancel = () => {
    setShowLibraryCropEditor(false);
    setOriginalLibraryImageForCrop('');
    // Reset file input
    const fileInput = document.getElementById('libraryPhoto');
    if (fileInput) fileInput.value = '';
    setLibraryPhoto(null);
  };

  const handleLibraryPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLibraryPhoto(file);
      const url = URL.createObjectURL(file);
      setOriginalLibraryImageForCrop(url);
      setShowLibraryCropEditor(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const name = (formData.name || '').trim();
    const description = (formData.description || '').trim();
    if (!name || !description) {
      alert('Please fill in all required fields');
      return;
    }

    // Determine photo to use based on editing state and user actions
    let photoToUse;
    if (editingId) {
      // When editing: use new photo if uploaded, otherwise keep original, or default if removed
      photoToUse = previewUrl || '/gpt-profiles/default-avatar.svg';
    } else {
      // When creating new: use uploaded photo or default
      photoToUse = previewUrl || '/gpt-profiles/default-avatar.svg';
    }

    const profileData = {
      id: editingId || Date.now(),
      name,
      description,
      specialties: [], // Removed specialties field
      photo: photoToUse
    };

    if (editingId) {
      onEditGPT(profileData);
      setEditingId(null);
    } else {
      onAddGPT(profileData);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      photo: null
    });
    setPreviewUrl('');
    setOriginalPhoto('');
    
    alert(editingId ? 'GPT profile updated successfully!' : 'GPT profile added successfully!');
  };

  const handleLibrarySubmit = (e) => {
    e.preventDefault();
    
    if (!libraryPhoto) {
      alert('Please select a photo to upload');
      return;
    }

    const newLibraryImage = {
      id: Date.now(),
      src: libraryPreviewUrl,
      alt: "Personal Photo"
    };

    onAddLibraryImage(newLibraryImage);
    
    // Reset library form
    setLibraryPhoto(null);
    setLibraryPreviewUrl('');
    
    alert('Photo added to library successfully!');
  };

  const handleEdit = (profile) => {
    setFormData({
      name: profile.name,
      description: profile.description,
      photo: null // Will be set when user uploads new photo
    });
    setPreviewUrl(profile.photo); // Show current photo as preview
    setOriginalPhoto(profile.photo); // Store original photo
    setEditingId(profile.id);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: '',
      description: '',
      photo: null
    });
    setPreviewUrl('');
    setOriginalPhoto('');
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      onDeleteGPT(id);
    }
  };

  const handleDeleteLibraryImage = (id) => {
    if (window.confirm('Are you sure you want to delete this photo from the library?')) {
      onDeleteLibraryImage(id);
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="header-main">
          <div className="header-left">
            <button className="collapse-btn" onClick={onToggleSidebar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="header-center">
            <div className="chat-title-container">
              <OthmanLogo />
              <h1>Admin Panel</h1>
            </div>
          </div>
          <div className="header-right">
            <button className="admin-logout-btn" onClick={onAdminLogout}>
              Logout
            </button>
            <button className="profile-btn" onClick={onProfileClick}>
              <div className="avatar-small">
                <img src="/profile-photo.jpg" alt="Othman Yehia" />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="admin-panel-page">
        <div className="library-header">
          <div className="library-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 15L8 11H16L12 15Z" fill="currentColor"/>
              <path d="M3 4H21V6H3V4ZM3 18H21V20H3V18ZM3 11H21V13H3V11Z" fill="currentColor"/>
            </svg>
          </div>
          <h1>Content Manager</h1>
          <p>Manage GPT profiles and photo library</p>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'gpts' ? 'active' : ''}`}
            onClick={() => setActiveTab('gpts')}
          >
            GPT Profiles
          </button>
          <button 
            className={`tab-button ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            Photo Library
          </button>
        </div>
        
        <div className="admin-content">
          {activeTab === 'gpts' ? (
            <>
              {/* GPT Management */}
              <div className="admin-form-container">
                <h3>{editingId ? 'Edit GPT Profile' : 'Add New GPT Profile'}</h3>
                <form onSubmit={handleSubmit} className="gpt-form">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter person's name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter a brief description..."
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="photo">Profile Photo (Optional)</label>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      onChange={handlePhotoChange}
                      accept="image/*"
                    />
                    {previewUrl && (
                      <div className="photo-preview">
                        <img src={previewUrl} alt="Preview" />
                        <div className="photo-preview-actions">
                          <button 
                            type="button" 
                            className="remove-photo-btn"
                            onClick={() => {
                              if (editingId) {
                                // When editing, remove photo (will use default on save)
                                setPreviewUrl('');
                              } else {
                                // When creating new, just clear preview
                                setPreviewUrl('');
                              }
                              setFormData(prev => ({ ...prev, photo: null }));
                              document.getElementById('photo').value = '';
                            }}
                          >
                            {editingId ? 'Remove Photo' : 'Remove Photo'}
                          </button>
                          {editingId && (
                            <span className="photo-edit-hint">
                              Upload a new photo to replace the current one, or remove to use default avatar
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      {editingId ? 'Update Profile' : 'Add Profile'}
                    </button>
                    {editingId && (
                      <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="existing-profiles">
                <h3>Manage GPT Profiles ({gptProfiles.length})</h3>
                <div className="profiles-list">
                  {gptProfiles.map((profile) => (
                    <div key={profile.id} className="profile-summary">
                      <img 
                        src={profile.photo} 
                        alt={profile.name}
                        onError={(e) => {
                          e.target.src = '/gpt-profiles/default-avatar.svg';
                        }}
                      />
                      <div className="profile-summary-info">
                        <h4>{profile.name}</h4>
                        <p>{profile.description.substring(0, 100)}...</p>
                      </div>
                      <div className="profile-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(profile)}
                          title="Edit profile"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(profile.id)}
                          title="Delete profile"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Library Management */}
              <div className="admin-form-container">
                <h3>Add Photo to Library</h3>
                <form onSubmit={handleLibrarySubmit} className="gpt-form">
                  <div className="form-group">
                    <label htmlFor="libraryPhoto">Select Photo *</label>
                    <input
                      type="file"
                      id="libraryPhoto"
                      onChange={handleLibraryPhotoChange}
                      accept="image/*"
                      required
                    />
                    {libraryPreviewUrl && (
                      <div className="photo-preview">
                        <img src={libraryPreviewUrl} alt="Library Preview" />
                      </div>
                    )}
                  </div>

                  <button type="submit" className="submit-btn">
                    Add to Library
                  </button>
                </form>
              </div>

              <div className="existing-profiles">
                <h3>Library Photos ({libraryImages.length})</h3>
                <div className="library-admin-grid">
                  {libraryImages.map((image) => (
                    <div key={image.id} className="library-admin-item">
                      <img src={image.src} alt={image.alt} />
                      <button 
                        className="delete-library-btn"
                        onClick={() => handleDeleteLibraryImage(image.id)}
                        title="Delete photo"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Image Crop Editor Modal */}
      {showCropEditor && (
        <ImageCropEditor
          imageSrc={originalImageForCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      
      {/* Library Image Crop Editor Modal */}
      {showLibraryCropEditor && (
        <ImageCropEditor
          imageSrc={originalLibraryImageForCrop}
          onCropComplete={handleLibraryCropComplete}
          onCancel={handleLibraryCropCancel}
        />
      )}
    </div>
  );
}

function Sidebar({ onLibraryClick, onChatClick, currentView, selectedChat, onChatSelect, collapsed, onProfileClick, onGPTClick, onAdminAccess }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onChatClick}>
          <PlusIcon />
          New chat
        </button>
      </div>
      
      <div className="sidebar-content">
        <div className="sidebar-menu">
          <div className="menu-item">
            <SearchIcon />
            <span>Search chats</span>
          </div>
          <div 
            className={`menu-item ${currentView === 'library' ? 'active' : ''}`}
            onClick={onLibraryClick}
          >
            <LibraryIcon />
            <span>Library</span>
          </div>
          <div 
            className={`menu-item ${currentView === 'gpts' ? 'active' : ''}`}
            onClick={onGPTClick}
          >
            <GPTIcon />
            <span>GPTs</span>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        <div className="projects-section">
          <div className="section-title">Projects</div>
          <div className="projects-list">
            {projectsList.map(project => (
              <div key={project.id} className="project-item">
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link"
                >
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
            {mockConversations.map(conv => (
              <div 
                key={conv.id}
                className={`chat-item ${selectedChat === conv.id ? 'active' : ''}`}
                onClick={() => onChatSelect(conv.id)}
              >
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
              onAdminAccess();
            } else {
              onProfileClick();
            }
          }}
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
}

function ChatArea({ selectedChat, onToggleSidebar, onProfileClick }) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(mockMessages[selectedChat] || []);
  const [showWelcome, setShowWelcome] = useState(messages.length === 0);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update messages when selectedChat changes
  useEffect(() => {
    setMessages(mockMessages[selectedChat] || []);
    setShowWelcome((mockMessages[selectedChat] || []).length === 0);
  }, [selectedChat]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
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
      <div className="chat-header">
        <div className="header-main">
          <div className="header-left">
            <button className="collapse-btn" onClick={onToggleSidebar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="header-center">
            <div className="chat-title-container">
              <OthmanLogo />
              <h1>Othman's GPT</h1>
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

      <div className="chat-messages">
        {showWelcome ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <OthmanLogo />
              <h2>How can I help you today?</h2>
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">
                  {message.role === 'assistant' && (
                    <div className="message-avatar">
                      <OthmanLogo />
                    </div>
                  )}
                  <div className="message-text">
                    {message.content.split('\n').map((line, i) => {
                      // Handle bold text formatting
                      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                      // Handle markdown links [text](url)
                      formattedLine = formattedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
                      return (
                        <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
                      );
                    })}
                  </div>
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
            <button 
              type="submit" 
              className="send-btn" 
              disabled={!inputValue.trim()}
            >
              <SendIcon />
            </button>
          </div>
        </form>
        <div className="input-footer">
          Othman's GPT can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ onClose }) {
  return (
    <div className="profile-modal" onClick={onClose}>
      <div className="profile-modal-overlay"></div>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-profile-modal" onClick={onClose}>
          <CloseIcon />
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
            <p>
              Born on May 26, 2005, I'm a cybersecurity and AI engineering student at Northern Technical University. 
              I'm the founder of OYAPS Studio and organizer of Ashur CTF 2025, passionate about advancing the tech 
              scene in Mosul and Iraq through innovation and community building.
            </p>
          </div>
          
          <div className="profile-section">
            <h3>Contact</h3>
            <div className="contact-links">
              <a href="mailto:othman.yehiaa@gmail.com" className="contact-link">
                📧 othman.yehiaa@gmail.com
              </a>
              <a href="tel:+964776515920" className="contact-link">
                📱 +964 776 515 5920
              </a>
              <a href="https://linkedin.com/in/othman-yehia-b37890377" target="_blank" rel="noopener noreferrer" className="contact-link">
                💼 LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'library', 'gpts', or 'admin'
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedChat, setSelectedChat] = useState(1);
  const [selectedGPT, setSelectedGPT] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  // Start with sidebar collapsed on mobile, open on desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 768);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // GPT profiles state with local storage
  const [gptProfiles, setGptProfiles] = useState(() => {
    const saved = localStorage.getItem('gptProfiles');
    return saved ? JSON.parse(saved) : initialGPTProfiles;
  });

  // Library images state with local storage
  const [libraryImages, setLibraryImages] = useState(() => {
    const saved = localStorage.getItem('libraryImages');
    return saved ? JSON.parse(saved) : initialLibraryImages;
  });

  // Save GPT profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gptProfiles', JSON.stringify(gptProfiles));
  }, [gptProfiles]);

  // Save library images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('libraryImages', JSON.stringify(libraryImages));
  }, [libraryImages]);

  // Check for admin route on page load
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setCurrentView('admin');
    }
  }, []);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarCollapsed(false); // Show sidebar on desktop
      } else {
        setSidebarCollapsed(true); // Hide sidebar on mobile
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLibraryClick = () => {
    setCurrentView('library');
  };

  const handleChatClick = () => {
    setCurrentView('chat');
  };

  const handleGPTClick = () => {
    setCurrentView('gpts');
  };

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
    setCurrentView('chat');
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleImageClose = () => {
    setSelectedImage(null);
  };

  const handleGPTSelect = (gpt) => {
    setSelectedGPT(gpt);
    // You can add logic here to open a chat with the selected GPT
  };

  const handleAddGPT = (newGPT) => {
    setGptProfiles(prev => [...prev, newGPT]);
  };

  const handleEditGPT = (updatedGPT) => {
    setGptProfiles(prev => prev.map(profile => 
      profile.id === updatedGPT.id ? updatedGPT : profile
    ));
  };

  const handleDeleteGPT = (id) => {
    setGptProfiles(prev => prev.filter(profile => profile.id !== id));
  };

  const handleAddLibraryImage = (newImage) => {
    setLibraryImages(prev => [...prev, newImage]);
  };

  const handleDeleteLibraryImage = (imageId) => {
    setLibraryImages(prev => prev.filter(image => image.id !== imageId));
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('chat');
    // Clear admin route
    window.history.pushState({}, '', '/');
  };

  const handleAdminAccess = () => {
    setCurrentView('admin');
    // Set admin route
    window.location.hash = 'admin';
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleProfileClose = () => {
    setShowProfileModal(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'library':
        return (
          <Library 
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
            onImageClose={handleImageClose}
            onToggleSidebar={toggleSidebar}
            onProfileClick={handleProfileClick}
            libraryImages={libraryImages}
          />
        );
      case 'gpts':
        return (
          <GPTLibrary 
            onToggleSidebar={toggleSidebar}
            onProfileClick={handleProfileClick}
            gptProfiles={gptProfiles}
            onGPTSelect={handleGPTSelect}
          />
        );
      case 'admin':
        if (isAdminAuthenticated) {
          return (
            <AdminPanel 
              onToggleSidebar={toggleSidebar}
              onProfileClick={handleProfileClick}
              gptProfiles={gptProfiles}
              onAddGPT={handleAddGPT}
              onEditGPT={handleEditGPT}
              onDeleteGPT={handleDeleteGPT}
              onAdminLogout={handleAdminLogout}
              libraryImages={libraryImages}
              onAddLibraryImage={handleAddLibraryImage}
              onDeleteLibraryImage={handleDeleteLibraryImage}
            />
          );
        } else {
          return <AdminLogin onAdminLogin={handleAdminLogin} />;
        }
      default:
        return (
          <ChatArea 
            selectedChat={selectedChat} 
            onToggleSidebar={toggleSidebar} 
            onProfileClick={handleProfileClick} 
          />
        );
    }
  };

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {!sidebarCollapsed && currentView !== 'admin' && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Only show sidebar if not in admin view or if admin is authenticated */}
      {(currentView !== 'admin' || isAdminAuthenticated) && (
        <Sidebar 
          onLibraryClick={handleLibraryClick}
          onChatClick={handleChatClick}
          onGPTClick={handleGPTClick}
          onAdminAccess={handleAdminAccess}
          currentView={currentView}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          collapsed={sidebarCollapsed}
          onProfileClick={handleProfileClick}
        />
      )}
      
      {renderCurrentView()}
      
      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal onClose={handleProfileClose} />
      )}
    </div>
  );
}
