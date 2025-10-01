import Icons from '../common/Icons';

export const Header = ({ 
  onToggleSidebar, 
  onProfileClick, 
  title = "Othman's GPT", 
  showLogout = false, 
  onLogout 
}) => {
  return (
    <div className="chat-header">
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
          {showLogout && (
            <button className="admin-logout-btn" onClick={onLogout}>
              Logout
            </button>
          )}
          <button className="profile-btn" onClick={onProfileClick}>
            <div className="avatar-small">
              <img src="/profile-photo.jpg" alt="Othman Yehia" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};