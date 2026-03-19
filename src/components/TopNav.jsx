import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, User } from 'lucide-react';
import Logo from './Logo';

const TopNav = () => {
    const navItems = [
        { path: '/dashboard', label: 'Applications' },
        { path: '/dashboard/maps', label: 'Maps' },
    ];

    return (
        <nav className="w-full bg-white/90 backdrop-blur-2xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-8">

                {/* Brand Logo */}
                <NavLink to="/dashboard" className="flex items-center gap-2 cursor-pointer group">
                    <Logo variant="full" showTagline={false} />
                </NavLink>

                {/* Navigation Links */}
                <div className="hidden lg:flex items-center gap-6 flex-grow">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) =>
                                `text-[13px] font-bold uppercase tracking-wider transition-all duration-300 py-2 px-3 rounded-md ${isActive
                                    ? 'text-white bg-emerald-600 shadow-sm shadow-emerald-500/30'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4 ml-auto">
                    <NavLink to="/profile" className={({ isActive }) => `w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center transition-all cursor-pointer ${isActive ? 'bg-emerald-100 text-emerald-600 border-emerald-200 shadow-sm' : 'bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200'}`}>
                        <User className="w-5 h-5" />
                    </NavLink>
                </div>

            </div>
        </nav>
    );
};

export default TopNav;
