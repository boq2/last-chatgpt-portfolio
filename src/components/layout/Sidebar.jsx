import { PROJECTS_LIST, MOCK_CONVERSATIONS } from '../../data/mockData';
import Icons from '../common/Icons';

export const Sidebar = ({ 
  onLibraryClick, 
  onChatClick, 
  currentView, 
  selectedChat, 
  onChatSelect, 
  onProfileClick, 
  onGPTClick, 
  onAdminAccess 
}) => {
  return (
    <div className="sidebar">
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
          <div 
            className={`menu-item ${currentView === 'library' ? 'active' : ''}`} 
            onClick={onLibraryClick}
          >
            <Icons.Library />
            <span>Library</span>
          </div>
          <div 
            className={`menu-item ${currentView === 'gpts' ? 'active' : ''}`} 
            onClick={onGPTClick}
          >
            <Icons.GPT />
            <span>GPTs</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        <div className="projects-section">
          <div className="section-title">Projects</div>
          <div className="projects-list">
            {PROJECTS_LIST.map(project => (
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

        <div className="sidebar-divider" />

        <div className="chat-history">
          <div className="chat-history-section">
            <div className="section-title">Chats</div>
            {MOCK_CONVERSATIONS.map(conv => (
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
          onClick={(e) => e.shiftKey ? onAdminAccess() : onProfileClick()} 
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
};