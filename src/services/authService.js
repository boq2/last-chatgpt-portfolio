import { account, ID } from '../config/appwrite';

class AuthService {
  // Register a new admin user
  async register(email, password, name = 'Admin') {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      console.log('User registered:', user);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      console.log('User logged in:', session);
      return session;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await account.deleteSession('current');
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      const session = await account.getSession('current');
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }
}

export default new AuthService();