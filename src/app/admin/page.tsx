"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import TopNavigation from '@/components/TopNavigation';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  Edit, 
  Trash2, 
  Search,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  FileText
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
  createdAt: string;
  lastLogin?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('home-care-users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with sample users including admin
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'admin@homecare.app',
          name: 'Admin User',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          id: '2',
          email: 'demo@homecare.app',
          name: 'Demo User',
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          email: 'guest@homecare.app',
          name: 'Guest User',
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('home-care-users', JSON.stringify(defaultUsers));
    }
  };

  // Enhanced admin authentication check
  useEffect(() => {
    const checkAdminAuth = () => {
      console.log('Starting admin auth check...');
      const authData = localStorage.getItem('home-care-auth');
      const legacyAuth = localStorage.getItem('isLoggedIn');
      const userEmail = localStorage.getItem('userEmail');
      
      console.log('Admin auth check - authData:', authData);
      console.log('Admin auth check - legacyAuth:', legacyAuth);
      console.log('Admin auth check - userEmail:', userEmail);
      
      // Check for modern auth data first
      if (authData) {
        try {
          const auth = JSON.parse(authData);
          console.log('Parsed auth data:', auth);
          
          if (auth.isAuthenticated && auth.user) {
            if (auth.user.role === 'admin' || auth.user.email === 'admin@homecare.app') {
              console.log('Admin authenticated successfully via modern auth');
              setIsLoading(false);
              loadUsers();
              return;
            } else {
              console.log('User role:', auth.user.role, 'not admin, redirecting');
              alert('Access denied. Administrator privileges required.');
              router.push('/login');
              return;
            }
          }
        } catch (error) {
          console.error('Error parsing auth data:', error);
        }
      }
      
      // Handle legacy auth - check if admin email
      if (legacyAuth === 'true' && userEmail === 'admin@homecare.app') {
        console.log('Legacy admin auth detected');
        setIsLoading(false);
        loadUsers();
        return;
      }
      
      // No valid auth found or not admin
      console.log('No valid admin auth found, redirecting to login');
      alert('Access denied. Administrator privileges required.');
      router.push('/login');
    };

    // Check auth immediately, then again after a small delay to handle race conditions
    checkAdminAuth();
    const timer = setTimeout(checkAdminAuth, 500);
    return () => clearTimeout(timer);
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CreateUserModal = () => {
    const [formData, setFormData] = useState({
      email: '',
      name: '',
      role: 'user' as 'admin' | 'user',
      password: '',
      confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      if (users.some(user => user.email === formData.email)) {
        alert('User with this email already exists');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        role: formData.role,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('home-care-users', JSON.stringify(updatedUsers));
      
      // Reset form and close modal
      setFormData({
        email: '',
        name: '',
        role: 'user',
        password: '',
        confirmPassword: ''
      });
      setIsCreateUserModalOpen(false);
    };

    if (!isCreateUserModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Create New User</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                  className="rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                  className="rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                  className="w-full p-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter password"
                    className="rounded-xl pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm password"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateUserModalOpen(false)}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  Create User
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  const ResetPasswordModal = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      // In a real app, you'd send this to a backend
      alert(`Password reset for ${selectedUser?.email} has been completed.`);
      setIsResetPasswordModalOpen(false);
      setSelectedUser(null);
      setNewPassword('');
      setConfirmPassword('');
    };

    if (!isResetPasswordModalOpen || !selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Reset Password</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Resetting password for: <strong>{selectedUser.email}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="rounded-xl pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsResetPasswordModalOpen(false);
                    setSelectedUser(null);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'disabled' as const : 'active' as const }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('home-care-users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('home-care-users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Toggle Menu - Snap, Tasks, and Admin */}
      <div className="bg-white border-b border-gray-200 sticky top-12 z-40">
        <div className="flex items-center justify-center px-6 py-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Snap</span>
            </button>
            <button 
              onClick={() => router.push('/tasks')}
              className="px-6 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Tasks</span>
            </button>
            <button 
              className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users, roles, and system settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Administrators</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Management</span>
              </CardTitle>
              <Button
                onClick={() => setIsCreateUserModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.role === 'admin' ? 'Administrator' : 'User'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status === 'active' ? 'Active' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsResetPasswordModalOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                            title="Reset Password"
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id)}
                            className="h-8 w-8 p-0"
                            title={user.status === 'active' ? 'Disable User' : 'Enable User'}
                          >
                            {user.status === 'active' ? 
                              <XCircle className="w-4 h-4 text-red-600" /> : 
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            }
                          </Button>
                          
                          {user.role !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      <CreateUserModal />
      <ResetPasswordModal />
    </div>
  );
} 