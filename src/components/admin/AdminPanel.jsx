// src/components/AdminPanel.jsx
import { useState, useEffect } from 'react';
import appwriteService from '../../services/appwriteService';
import '../../app.css';

const AdminPanel = ({ onToggleSidebar, onProfileClick, onAdminLogout }) => {
  const [activeTab, setActiveTab] = useState('gpts');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // GPT Profiles State
  const [gptProfiles, setGptProfiles] = useState([]);
  const [gptFormData, setGptFormData] = useState({
    name: '',
    description: '',
    photo: null
  });
  const [gptPreviewUrl, setGptPreviewUrl] = useState('');
  const [editingGptId, setEditingGptId] = useState(null);

  // Library Images State
  const [libraryImages, setLibraryImages] = useState([]);
  const [libraryPhoto, setLibraryPhoto] = useState(null);
  const [libraryPreviewUrl, setLibraryPreviewUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  const loadData = async () => {
    try {
      console.log('🔄 Loading data from Appwrite...');
      const [profiles, images] = await Promise.all([
        appwriteService.getAllGPTProfiles(),
        appwriteService.getAllLibraryImages()
      ]);

      setGptProfiles(
        profiles.map(p => ({
          id: p.$id,
          name: p.name,
          description: p.description,
          photo: p.photo,
          specialties: p.specialties || []
        }))
      );

      setLibraryImages(
        images.map(img => ({
          id: img.$id,
          src: img.src,
          alt: img.alt
        }))
      );

      console.log('✅ Data loaded successfully');
      console.log(`📋 GPT Profiles: ${profiles.length}`);
      console.log(`🖼️ Library Images: ${images.length}`);
    } catch (e) {
      console.error('❌ Error loading data:', e);
      setError(`Failed to load data: ${e.message}`);
    }
  };

  // GPT Profile Handlers
  const handleGptInputChange = (e) => {
    const { name, value } = e.target;
    setGptFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleGptPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Profile photo must be less than 5MB');
        e.target.value = '';
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WebP, or GIF)');
        e.target.value = '';
        return;
      }
      setGptFormData(prev => ({ ...prev, photo: file }));
      setGptPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleGptSubmit = async (e) => {
    e.preventDefault();

    const name = (gptFormData.name || '').trim();
    const description = (gptFormData.description || '').trim();

    if (!name || !description) {
      setError('Please fill in all required fields (Name and Description)');
      return;
    }
    if (name.length > 100) {
      setError('Name must be less than 100 characters');
      return;
    }
    if (description.length > 500) {
      setError('Description must be less than 500 characters');
      return;
    }
    if (!editingGptId && !gptFormData.photo) {
      setError('Profile photo is required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        name,
        description,
        specialties: [],
        photoFile: gptFormData.photo
      };

      if (editingGptId) {
        profileData.photo = gptProfiles.find(p => p.id === editingGptId)?.photo;
        await appwriteService.updateGPTProfile(editingGptId, profileData);
        setSuccess('GPT profile updated successfully! 🎉');
      } else {
        await appwriteService.createGPTProfile(profileData);
        setSuccess('GPT profile created successfully! 🎉');
      }

      await loadData();
      resetGptForm();
    } catch (e) {
      console.error('❌ Error saving GPT profile:', e);
      setError(`Failed to ${editingGptId ? 'update' : 'create'} GPT profile: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetGptForm = () => {
    setGptFormData({ name: '', description: '', photo: null });
    setGptPreviewUrl('');
    setEditingGptId(null);
    const fileInput = document.getElementById('gpt-photo');
    if (fileInput) fileInput.value = '';
  };

  const handleEditGpt = (profile) => {
    setGptFormData({ name: profile.name, description: profile.description, photo: null });
    setGptPreviewUrl(profile.photo);
    setEditingGptId(profile.id);
    setActiveTab('gpts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError('');
    setSuccess('');
  };

  const handleDeleteGpt = async (id) => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      try {
        setError('');
        await appwriteService.deleteGPTProfile(id);
        await loadData();
        setSuccess('Profile deleted successfully! 🗑️');
      } catch (e) {
        console.error('❌ Error deleting profile:', e);
        setError(`Failed to delete profile: ${e.message}`);
      }
    }
  };

  // Library Handlers
  const handleLibraryPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Library photo must be less than 10MB');
        e.target.value = '';
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WebP, or GIF)');
        e.target.value = '';
        return;
      }
      setLibraryPhoto(file);
      setLibraryPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleLibrarySubmit = async (e) => {
    e.preventDefault();

    if (!libraryPhoto) {
      setError('Please select a photo to upload');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await appwriteService.createLibraryImage(libraryPhoto, 'Personal Photo');
      await loadData();

      setLibraryPhoto(null);
      setLibraryPreviewUrl('');
      const fileInput = document.getElementById('library-photo');
      if (fileInput) fileInput.value = '';

      setSuccess('Photo added to library successfully! 📸');
    } catch (e) {
      console.error('❌ Error adding library image:', e);
      setError(`Failed to add photo to library: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLibraryImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      try {
        setError('');
        await appwriteService.deleteLibraryImage(id);
        await loadData();
        setSuccess('Photo deleted successfully! 🗑️');
      } catch (e) {
        console.error('❌ Error deleting photo:', e);
        setError(`Failed to delete photo: ${e.message}`);
      }
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
              <img src="/othman-logo.svg" alt="Logo" width="32" height="32" style={{ filter: 'brightness(0) invert(1)' }} />
              <h1>Admin Panel</h1>
            </div>
          </div>
          <div className="header-right">
            <button className="admin-logout-btn" onClick={onAdminLogout}>Logout</button>
            <button className="profile-btn" onClick={onProfileClick}>
              <div className="avatar-small">
                <img src="/profile-photo.jpg" alt="Profile" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-panel-page">
        <div className="library-header">
          <div className="library-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M3 4H21V6H3V4ZM3 18H21V20H3V18ZM3 11H21V13H3V11Z" fill="currentColor"/>
            </svg>
          </div>
          <h1>Content Manager</h1>
          <p>Manage GPT profiles and photo library - All data syncs with Appwrite cloud</p>
        </div>

        {error && (
          <div className="message-banner error">
            <span>❌ {error}</span>
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        {success && (
          <div className="message-banner success">
            <span>✅ {success}</span>
            <button onClick={() => setSuccess('')}>✕</button>
          </div>
        )}

        <div className="admin-tabs">
          <button className={`tab-button ${activeTab === 'gpts' ? 'active' : ''}`} onClick={() => setActiveTab('gpts')}>
            GPT Profiles ({gptProfiles.length})
          </button>
          <button className={`tab-button ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
            Photo Library ({libraryImages.length})
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'gpts' ? (
            <>
              <div className="admin-form-container">
                <h3>{editingGptId ? 'Edit GPT Profile' : 'Add New GPT Profile'}</h3>
                <form onSubmit={handleGptSubmit} className="gpt-form">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={gptFormData.name}
                      onChange={handleGptInputChange}
                      placeholder="Enter person's name"
                      required
                      disabled={isSubmitting}
                      maxLength={100}
                    />
                    <small className="char-count">{gptFormData.name.length}/100 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={gptFormData.description}
                      onChange={handleGptInputChange}
                      placeholder="Enter a brief description..."
                      rows="4"
                      required
                      disabled={isSubmitting}
                      maxLength={500}
                    />
                    <small className="char-count">{gptFormData.description.length}/500 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="gpt-photo">Profile Photo</label>
                    <input
                      type="file"
                      id="gpt-photo"
                      onChange={handleGptPhotoChange}
                      accept="image/*"
                      disabled={isSubmitting}
                      required={!editingGptId}
                    />
                    <small className="file-hint">Max 5MB. JPG, PNG, WebP, or GIF</small>
                    {gptPreviewUrl && (
                      <div className="photo-preview">
                        <img src={gptPreviewUrl} alt="Preview" />
                        <div className="photo-preview-actions">
                          <button
                            type="button"
                            className="remove-photo-btn"
                            onClick={() => {
                              setGptPreviewUrl('');
                              setGptFormData(prev => ({ ...prev, photo: null }));
                              const input = document.getElementById('gpt-photo');
                              if (input) input.value = '';
                            }}
                            disabled={isSubmitting}
                          >
                            Remove Photo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting
                        ? (editingGptId ? 'Updating...' : 'Adding...')
                        : (editingGptId ? 'Update Profile' : 'Add Profile')}
                    </button>
                    {editingGptId && (
                      <button type="button" className="cancel-btn" onClick={resetGptForm} disabled={isSubmitting}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="existing-profiles">
                <h3>Manage GPT Profiles ({gptProfiles.length})</h3>
                {gptProfiles.length === 0 ? (
                  <div className="empty-state">
                    <p>No GPT profiles yet. Add your first profile above! 👆</p>
                  </div>
                ) : (
                  <div className="profiles-list">
                    {gptProfiles.map((profile) => (
                      <div key={profile.id} className="profile-summary">
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          onError={(e) => (e.currentTarget.src = '/gpt-profiles/default-avatar.svg')}
                        />
                        <div className="profile-summary-info">
                          <h4>{profile.name}</h4>
                          <p>{profile.description.substring(0, 100)}{profile.description.length > 100 ? '...' : ''}</p>
                        </div>
                        <div className="profile-actions">
                          <button className="edit-btn" onClick={() => handleEditGpt(profile)} disabled={isSubmitting}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 20H21M16.5 3.5A2.121 2.121 0 0 1 19 6L7 18L3 19L4 15L16.5 3.5Z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteGpt(profile.id)} disabled={isSubmitting}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6H5H21M8 6V4A2 2 0 0 1 10 2H14A2 2 0 0 1 16 4V6M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6H19Z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="admin-form-container">
                <h3>Add Photo to Library</h3>
                <form onSubmit={handleLibrarySubmit} className="gpt-form">
                  <div className="form-group">
                    <label htmlFor="library-photo">Select Photo *</label>
                    <input
                      type="file"
                      id="library-photo"
                      onChange={handleLibraryPhotoChange}
                      accept="image/*"
                      required
                      disabled={isSubmitting}
                    />
                    <small className="file-hint">Max 10MB. JPG, PNG, WebP, or GIF</small>
                    {libraryPreviewUrl && (
                      <div className="photo-preview">
                        <img src={libraryPreviewUrl} alt="Library Preview" />
                      </div>
                    )}
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding to Library...' : 'Add to Library'}
                  </button>
                </form>
              </div>

              <div className="existing-profiles">
                <h3>Library Photos ({libraryImages.length})</h3>
                {libraryImages.length === 0 ? (
                  <div className="empty-state">
                    <p>No photos in library yet. Add your first photo above! 👆</p>
                  </div>
                ) : (
                  <div className="library-admin-grid">
                    {libraryImages.map((image) => (
                      <div key={image.id} className="library-admin-item">
                        <img src={image.src} alt={image.alt} />
                        <button
                          className="delete-library-btn"
                          onClick={() => handleDeleteLibraryImage(image.id)}
                          disabled={isSubmitting}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2"/>
                            <path d="M8 6V4A2 2 0 0 1 10 2H14A2 2 0 0 1 16 4V6" stroke="currentColor" strokeWidth="2"/>
                            <path d="M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6H19Z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
