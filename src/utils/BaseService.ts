
export class BaseService {
  protected static getCurrentUserId(): string | null {
    try {
      const authData = localStorage.getItem('fuelninja-auth');
      if (!authData) return null;
      
      const user = JSON.parse(authData);
      return user.id || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  protected static clearData(key: string): void {
    localStorage.removeItem(key);
  }
}
