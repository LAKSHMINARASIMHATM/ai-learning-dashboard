'use client';



import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Lock, Palette, Users, Key, ShieldCheck, Monitor, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    learningGoal: 'Full Stack Development', // This would ideally come from backend too
  });

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Active Sessions State
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          learningGoal: 'Full Stack Development',
        });
      }
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await api.updateProfile(formData.name);
      if (res.success) {
        toast.success('Profile updated successfully!');
        // Update local user state
        setUser({ ...user, name: formData.name });
        // Update local storage if needed
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          localStorage.setItem('user', JSON.stringify({ ...parsed, name: formData.name }));
        }
      } else {
        toast.error(res.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleSettingChange = async (key: string, value: any) => {
    // Optimistic update
    const newPreferences = { ...user.preferences, [key]: value };
    setUser({ ...user, preferences: newPreferences });

    try {
      const res = await api.updateSettings({ [key]: value });
      if (!res.success) {
        // Revert on failure
        toast.error('Failed to save setting');
        fetchUserData();
      }
    } catch (error) {
      toast.error('Failed to save setting');
      fetchUserData();
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await api.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      if (res.success) {
        toast.success('Password updated successfully');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.error || 'Failed to update password');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion requires administrative approval. Support ticket created.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6 max-w-2xl">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Learning Goal
              </label>
              <select
                value={formData.learningGoal}
                onChange={(e) => setFormData({ ...formData, learningGoal: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Full Stack Development</option>
                <option>Frontend Development</option>
                <option>Backend Development</option>
                <option>Data Science</option>
              </select>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleProfileUpdate}
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Get updates about courses and progress</p>
              </div>
              <input
                type="checkbox"
                checked={user?.preferences?.emailUpdates ?? true}
                onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                className="w-5 h-5"
              />
            </div>
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts in the browser</p>
              </div>
              <input
                type="checkbox"
                checked={user?.preferences?.notifications ?? true}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="w-5 h-5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Theme
              </label>
              <div className="space-y-2">
                {['light', 'dark', 'system'].map((theme) => (
                  <label key={theme} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={user?.preferences?.theme === theme}
                      onChange={() => handleSettingChange('theme', theme)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground capitalize">{theme} Mode</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent hover:bg-muted/50 transition-all"
              onClick={() => setShowPasswordModal(true)}
            >
              <Key className="w-4 h-4 text-primary" />
              Change Password
            </Button>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Two-Factor Authentication</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  checked={user?.preferences?.twoFactorEnabled ?? false}
                  onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5"
                />
                <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${user?.preferences?.twoFactorEnabled ? 'bg-primary' : 'bg-gray-300'}`}></label>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent hover:bg-muted/50 transition-all"
              onClick={() => setShowSessionsModal(true)}
            >
              <Monitor className="w-4 h-4 text-primary" />
              Active Sessions
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5 shadow-none">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Irreversible actions. Proceed with caution.
            </p>
            <Button
              variant="destructive"
              className="w-full shadow-lg shadow-destructive/20 hover:scale-[1.02] transition-transform"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
              <Button onClick={handlePasswordChange}>Update Password</Button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold">Active Sessions</h3>
              <button onClick={() => setShowSessionsModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <Monitor className="text-primary" />
                  <div>
                    <p className="font-bold text-sm">Windows PC - Chrome</p>
                    <p className="text-xs text-muted-foreground">Bangalore, India • Current Session</p>
                  </div>
                </div>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">Active</span>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
              <Button variant="outline" onClick={() => setShowSessionsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
