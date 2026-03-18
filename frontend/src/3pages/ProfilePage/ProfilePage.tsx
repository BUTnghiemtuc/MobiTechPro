import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
import { userService, type UserProfile } from '../../1services/user.service';
import { toast } from 'react-toastify';
import styles from './ProfilePage.module.css';

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
        <div className={styles.div_1}>
            <div className={styles.div_2}></div>
        </div>
    );

    return (
        <div className={styles.div_3}>
            <div className={styles.div_4}>
                <h1 className={styles.h1_1}>Account Settings.</h1>
                
                <div className={styles.div_5}>
                    {/* Sidebar Card */}
                    <div className={styles.div_6}>
                        <div className={`${styles.div_7} group`} onClick={() => setIsAvatarModalOpen(true)}>
                            <div className={styles.div_8}>
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className={styles.img_1} />
                                ) : (
                                    <div className={styles.div_9}>
                                         {profile?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className={styles.div_10}>
                                <svg className={styles.svg_1} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <button className={styles.button_1}>
                                <svg className={styles.svg_2} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                        </div>
                        
                        <h2 className={styles.h2_1}>{profile?.username}</h2>
                        <p className={styles.p_1}>{profile?.email}</p>

                        <nav className={styles.nav_1}>
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                                    activeTab === 'info' 
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <svg className={styles.svg_3} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
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
                                <svg className={styles.svg_3} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Security
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Card */}
                    <div className={styles.div_11}>
                        {activeTab === 'info' && (
                            <form onSubmit={handleInfoSubmit} className={styles.form_1}>
                                <div className={styles.div_12}>
                                    <h3 className={styles.h3_1}>Personal Information</h3>
                                    <button className={styles.button_2}>
                                        Save Changes
                                    </button>
                                </div>
                                <div className={styles.div_13}>
                                    <div className="space-y-2">
                                        <label className={styles.label_1}>First Name</label>
                                        <input
                                            type="text"
                                            className={styles.input_1}
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={styles.label_1}>Last Name</label>
                                        <input
                                            type="text"
                                            className={styles.input_1}
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                            placeholder="Doe"
                                        />
                                    </div>
                                    <div className={styles.div_14}>
                                        <label className={styles.label_1}>Phone Number</label>
                                        <input
                                            type="tel"
                                            className={styles.input_1}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className={styles.div_14}>
                                        <label className={styles.label_1}>Shipping Address</label>
                                        <textarea
                                            rows={4}
                                            className={styles.textarea_1}
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            placeholder="Enter your full shipping address..."
                                        />
                                    </div>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordSubmit} className={styles.form_1}>
                                <div className={styles.div_15}>
                                    <h3 className={styles.h3_1}>Security & Password</h3>
                                    <p className={styles.p_2}>Ensure your account is using a long, random password to stay secure.</p>
                                </div>
                                <div className={styles.div_16}>
                                    <div className="space-y-2">
                                        <label className={styles.label_1}>Current Password</label>
                                        <input
                                            type="password"
                                            className={styles.input_1}
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={styles.label_1}>New Password</label>
                                        <input
                                            type="password"
                                            className={styles.input_1}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={styles.label_1}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className={styles.input_1}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button className={styles.button_3}>
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
                <div className={styles.div_17} onClick={() => setIsAvatarModalOpen(false)}>
                    <div className={styles.div_18} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.div_19}>
                             <h3 className={styles.h3_2}>Choose an Avatar</h3>
                             <button onClick={() => setIsAvatarModalOpen(false)} className={styles.el_1}>
                                 <svg className={styles.svg_4} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                        </div>
                        
                        <div className={styles.div_20}>
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
                                    <img src={url} alt={`Avatar ${index + 1}`} className={styles.img_1} />
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center">
                            <p className={styles.p_3}>Or enter a custom URL</p>
                            <input 
                                type="text" 
                                placeholder="https://example.com/my-avatar.png"
                                className={styles.input_2}
                                value={formData.avatar_url}
                                onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                            />
                            <button 
                                onClick={() => setIsAvatarModalOpen(false)}
                                className={styles.el_2}
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
