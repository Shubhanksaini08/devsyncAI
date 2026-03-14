import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import founderImg from '../assets/founder.jpeg';

const Landing = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, [user]);

    const logout = () => {
        localStorage.removeItem('token');
        axios.get('/users/logout').catch(err => console.log(err));
        setUser(null);
        setIsAuthenticated(false);
        setIsProfileOpen(false);
        navigate('/');
    };

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'} font-sans selection:bg-blue-500/30 overflow-hidden relative transition-colors duration-500`}>
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-[120px] ${isDarkMode ? 'opacity-100' : 'opacity-40'}`}></div>
            </div>

            {/* Navigation */}
            <nav className={`relative z-50 border-b ${isDarkMode ? 'border-gray-800/50 bg-gray-950/50' : 'border-gray-200 bg-white/70'} backdrop-blur-xl sticky top-0`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="DevSync AI Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-blue-500/20 transform rotate-3" />
                            <span className={`text-2xl font-bold ${isDarkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400' : 'text-gray-900'}`}>
                                DevSync AI
                            </span>
                        </Link>
                        <button onClick={() => scrollToSection('how-it-works')} className={`hidden md:block text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            How It Works
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 text-yellow-400 hover:bg-gray-800' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'}`}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <i className="ri-sun-line text-lg"></i> : <i className="ri-moon-line text-lg"></i>}
                        </button>

                        <div className={`w-px h-6 mx-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className={`px-4 py-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                    Sign In
                                </Link>
                                <Link to="/register" className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg ${isDarkMode ? 'bg-white text-gray-950 hover:bg-gray-200 shadow-white/5' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'}`}>
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${isDarkMode ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 border border-gray-700' : 'bg-blue-600 text-white shadow-blue-500/20 border border-blue-400'}`}
                                >
                                    {user?.name ? user.name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U')}
                                </button>

                                {isProfileOpen && (
                                    <div className={`absolute right-0 mt-3 w-56 rounded-2xl border shadow-2xl overflow-hidden z-50 transform origin-top-right transition-all animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                                        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-50 bg-gray-50/50'}`}>
                                            <p className={`text-xs uppercase tracking-widest font-bold mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Logged in as</p>
                                            <p className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name || user?.email || 'Developer'}</p>
                                        </div>
                                        <div className="p-2">
                                            <button 
                                                onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                <i className="ri-layout-grid-line text-lg text-blue-500"></i>
                                                My Dashboard
                                            </button>
                                            <button 
                                               onClick={logout}
                                               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                                            >
                                                <i className="ri-logout-box-line text-lg"></i>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    DevSync AI 1.0 is now live
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                    Build Software <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                        Faster, Together.
                    </span>
                </h1>
                
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                    An AI-powered collaborative development environment. Real-time chat, shared file trees, and instant code execution—all running right in your browser.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                         onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                         className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2"
                    >
                        {isAuthenticated ? 'Open Your Projects' : 'Start Coding Now'} <i className="ri-arrow-right-line"></i>
                    </button>
                    {!isAuthenticated && (
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-medium bg-gray-900 border border-gray-800 text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            <i className="ri-github-fill text-xl"></i> Continue with GitHub
                        </button>
                    )}
                </div>

                {/* Mockup Preview UI */}
                <div className="mt-20 relative mx-auto max-w-5xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 bottom-0 top-1/2"></div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900/80 backdrop-blur shadow-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] transform perspective-[1000px] rotateX-[5deg] scale-95 origin-top transition-transform duration-700 hover:rotateX-[0deg] hover:scale-100">
                        <div className="h-10 border-b border-gray-800 flex items-center px-4 gap-2 bg-gray-900">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <div className="mx-auto text-xs text-gray-500 font-medium">devsync-ai/workspace</div>
                        </div>
                        <div className="p-8 text-left grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
                            {/* Fake Chat */}
                            <div className="col-span-1 border-r border-gray-800 pr-6 space-y-4">
                                <div className="p-3 rounded-lg bg-gray-800/80 border border-gray-700/50 text-sm text-gray-300">
                                    Can you create an Express server for this project?
                                </div>
                                <div className="p-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-sm text-blue-200">
                                    I've generated the server.js file and mounted it to the workspace.
                                </div>
                            </div>
                            {/* Fake Code */}
                            <div className="col-span-2 space-y-3 font-mono text-sm text-gray-400">
                                <p><span className="text-purple-400">import</span> express <span className="text-purple-400">from</span> <span className="text-green-400">'express'</span>;</p>
                                <p><span className="text-purple-400">const</span> app = <span className="text-blue-400">express</span>();</p>
                                <br />
                                <p>app.<span className="text-blue-400">get</span>(<span className="text-green-400">'/'</span>, (req, res) <span className="text-purple-400">=&gt;</span> {'{'}</p>
                                <p className="pl-4">res.<span className="text-blue-400">send</span>(<span className="text-green-400">'Hello from DevSync!'</span>);</p>
                                <p>{'}'});</p>
                                <br />
                                <p>app.<span className="text-blue-400">listen</span>(<span className="text-orange-400">3000</span>, () <span className="text-purple-400">=&gt;</span> <span className="text-blue-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-green-400">'Running...'</span>));</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Feature Grid */}
            <section className={`relative z-10 max-w-7xl mx-auto px-6 py-24 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className={`p-8 rounded-2xl border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm'}`}>
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl mb-6">
                            <i className="ri-robot-2-line"></i>
                        </div>
                        <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Pair Programmer</h3>
                        <p className={isDarkMode ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>Generate code, create full architectures, and debug errors instantly using our integrated AI agent context-aware of your files.</p>
                    </div>
                    <div className={`p-8 rounded-2xl border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm'}`}>
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl mb-6">
                            <i className="ri-macbook-line"></i>
                        </div>
                        <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Browser Runtime</h3>
                        <p className={isDarkMode ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>Execute Node.js servers, install NPM packages, and preview web apps entirely within your browser using WebContainers.</p>
                    </div>
                    <div className={`p-8 rounded-2xl border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm'}`}>
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center text-2xl mb-6">
                            <i className="ri-team-line"></i>
                        </div>
                        <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Real-time Collaboration</h3>
                        <p className={isDarkMode ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>Invite peers to your workspace. Sync file changes, share the terminal instance, and communicate through built-in sockets.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className={`relative z-10 max-w-7xl mx-auto px-6 py-24 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200'}`}>
                <div className="text-center mb-16">
                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How DevSync Works</h2>
                    <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Three simple steps to supercharge your development.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connection Line */}
                    <div className={`hidden md:block absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 z-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                    
                    {[
                        { step: "1", title: "Create a workspace", desc: "Start a new project in seconds and get a fully functional browser-based environment.", icon: "ri-folder-add-line" },
                        { step: "2", title: "Invite teammates", desc: "Share your workspace link with your team for real-time multiplayer coding and chat.", icon: "ri-user-add-line" },
                        { step: "3", title: "Code together with AI", desc: "Leverage our AI assistant to generate features, fix bugs, and deploy instantly.", icon: "ri-rocket-2-line" }
                    ].map((item, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${isDarkMode ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-blue-600 text-white shadow-blue-500/20'}`}>
                                <i className={item.icon}></i>
                                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center border-4 border-blue-600">{item.step}</span>
                            </div>
                            <h4 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            {/* Dedicated Founder Section */}
            <section className={`relative z-10 max-w-7xl mx-auto px-6 py-32 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200'}`}>
                <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                        The Mastermind
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-bold mb-16 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Meet the Visionary</h2>
                    
                    <div className="relative group max-w-3xl w-full">
                        {/* Interactive Background Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-300"></div>
                        
                        <div className={`relative backdrop-blur-3xl border p-10 md:p-16 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-gray-900/40 border-gray-800/50 group-hover:border-gray-700/50' : 'bg-white border-gray-200 group-hover:border-gray-300 shadow-gray-200/50'}`}>
                            {/* Decorative background gradients */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl -ml-40 -mb-40"></div>

                            <div className="flex flex-col items-center gap-10 relative z-10">
                                <div className="relative">
                                    <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-2xl shadow-blue-500/30">
                                        <div className="w-full h-full rounded-full border-4 border-gray-950 overflow-hidden bg-gray-900">
                                            <img 
                                                src={founderImg} 
                                                alt="Astik Gupta" 
                                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                                            />
                                        </div>
                                    </div>
                                    {/* Animated Status badge */}
                                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-green-500 border-4 border-gray-950 rounded-full shadow-lg shadow-green-500/20">
                                        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
                                    </div>
                                </div>

                                <div className="max-w-xl text-center">
                                    <h4 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Astik Gupta</h4>
                                    <p className="text-blue-400 font-bold mb-8 tracking-[0.2em] uppercase text-xs">Founder of DevSync AI</p>
                                    
                                    <div className={`h-px w-32 bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto mb-10 ${isDarkMode ? 'opacity-100' : 'opacity-20'}`}></div>
                                    
                                    <p className={`text-lg md:text-xl leading-relaxed font-light italic ${isDarkMode ? 'text-gray-300 opacity-90' : 'text-gray-600 opacity-100'}`}>
                                        "Astik is a Computer Science engineer and developer building AI-powered tools for modern software teams. <span className={isDarkMode ? "text-white font-medium" : "text-gray-900 font-bold"}>DevSync AI</span> was created to help developers collaborate in real time, write better code, and build products faster using intelligent, context-aware AI assistance."
                                    </p>
                                </div>

                                <div className="flex gap-6 mt-2">
                                    <a href="https://www.linkedin.com/in/astik-gupta-a625b1244/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                                        <i className="ri-linkedin-box-fill text-xl"></i>
                                    </a>
                                    <a href="https://github.com/astikgupta" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:bg-gray-950 hover:text-white transition-all transform hover:-translate-y-1 border border-gray-700">
                                        <i className="ri-github-fill text-xl"></i>
                                    </a>
                                    <a href="https://astikgupta-git-main-astik-guptas-projects.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1">
                                        <i className="ri-global-line text-xl"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Optimized Global Footer */}
            <footer className={`relative z-10 border-t py-16 transition-colors duration-500 ${isDarkMode ? 'border-gray-800/50 bg-gray-950' : 'border-gray-200 bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="DevSync AI Logo" className="w-10 h-10 rounded-xl shadow-lg" />
                            <span className={`text-2xl font-bold ${isDarkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500' : 'text-gray-900'}`}>
                                DevSync AI
                            </span>
                        </div>
                        
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <p className="text-gray-500 text-sm font-medium tracking-wide">
                                &copy; {new Date().getFullYear()} DevSync AI. All rights reserved. <span className={`ml-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-400'}`}>#DoNotCopy</span>
                            </p>
                            <div className={`flex gap-6 text-xs uppercase tracking-widest font-bold ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
                                <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
                                <a href="#" className="hover:text-blue-400 transition-colors">Security</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
