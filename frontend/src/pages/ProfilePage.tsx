import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
import { userService, type UserProfile } from '../services/user.service';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    // const { user } = useAuth(); // Unused
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        avatar_url: '',
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const avatarSamples = [
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Jack',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Bella',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Luna',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Leo',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Max',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Milo',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Willow',
        'https://api.dicebear.com/9.x/avataaars/svg?seed=Ruby',
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                phone: data.phone || '',
                address: data.address || '',
                avatar_url: data.avatar_url || '',
            });
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.updateProfile(formData);
            toast.success("Profile updated successfully");
            fetchProfile();
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        try {
            await userService.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password changed successfully");
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to change password");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-8 tracking-tight">Account Settings.</h1>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Sidebar Card */}
                    <div className="w-full md:w-80 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center sticky top-28">
                        <div className="relative group cursor-pointer mb-6" onClick={() => setIsAvatarModalOpen(true)}>
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 ring-4 ring-white shadow-lg transition-transform group-hover:scale-105">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-4xl font-bold">
                                         {profile?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <button className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full shadow-lg hover:bg-black transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                        </div>
                        
                        <h2 className="font-bold text-xl text-slate-900 mb-1">{profile?.username}</h2>
                        <p className="text-sm text-slate-500 mb-8 font-medium">{profile?.email}</p>

                        <nav className="w-full space-y-2">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                                    activeTab === 'info' 
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                Personal Info
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                                    activeTab === 'security' 
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Security
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Card */}
                    <div className="flex-1 w-full bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                        {activeTab === 'info' && (
                            <form onSubmit={handleInfoSubmit} className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
                                    <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-slate-900/20 active:scale-95 text-sm">
                                        Save Changes
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all outline-none"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all outline-none"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                            placeholder="Doe"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all outline-none"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipping Address</label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all outline-none resize-none"
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            placeholder="Enter your full shipping address..."
                                        />
                                    </div>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-8 animate-fade-in">
                                <div className="pb-6 border-b border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-900">Security & Password</h3>
                                    <p className="text-slate-500 text-sm mt-1">Ensure your account is using a long, random password to stay secure.</p>
                                </div>
                                <div className="space-y-6 max-w-lg">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all outline-none"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all outline-none"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all outline-none"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button className="bg-red-50 text-red-600 border border-red-100 px-8 py-3 rounded-full font-medium hover:bg-red-600 hover:text-white transition-all hover:scale-105 active:scale-95 text-sm">
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Avatar Selection Modal */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsAvatarModalOpen(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-2xl font-bold text-slate-900">Choose an Avatar</h3>
                             <button onClick={() => setIsAvatarModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                        </div>
                        
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 mb-8">
                            {avatarSamples.map((url, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => {
                                        setFormData({ ...formData, avatar_url: url });
                                        setIsAvatarModalOpen(false);
                                    }}
                                    className={`aspect-square rounded-full overflow-hidden cursor-pointer border-4 transition-all hover:scale-110 ${
                                        formData.avatar_url === url ? 'border-primary-600 scale-105 shadow-lg' : 'border-transparent hover:border-slate-200'
                                    }`}
                                >
                                    <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center">
                            <p className="text-slate-500 text-sm mb-4">Or enter a custom URL</p>
                            <input 
                                type="text" 
                                placeholder="https://example.com/my-avatar.png"
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none mb-4"
                                value={formData.avatar_url}
                                onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                            />
                            <button 
                                onClick={() => setIsAvatarModalOpen(false)}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
