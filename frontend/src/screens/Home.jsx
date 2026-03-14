import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"

const Home = () => {

    const { user } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState(null)
    const [ project, setProject ] = useState([])

    const navigate = useNavigate()

    function logout() {
        localStorage.removeItem('token')
        axios.get('/users/logout').catch(err => console.log(err))
        navigate('/login')
    }

    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log(res)
                setIsModalOpen(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)

        }).catch(err => {
            console.log(err)
        })

    }, [])

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
            {/* Global Header */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-gray-950/80 border-b border-gray-800 support-backdrop-blur:bg-white/60">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="DevSync AI Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-blue-500/20" />
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                            DevSync AI
                        </h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 mr-4">
                            <span className="text-sm text-gray-400 hidden sm:inline-block font-medium">{user?.name || user?.email || 'User'}</span>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-gray-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
                                {user?.name ? user.name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : <i className="ri-user-3-line"></i>)}
                            </div>
                        </div>
                        <button onClick={logout} className="flex items-center gap-2 group cursor-pointer focus:outline-none">
                            <span className="text-sm font-medium text-gray-400 group-hover:text-red-400 transition-colors hidden sm:inline-block">Logout</span>
                            <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-all">
                                <i className="ri-logout-box-r-line text-gray-300 group-hover:text-red-400"></i>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <main className='flex-grow container mx-auto px-6 py-10'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">Your Projects</h2>
                        <p className="text-gray-400 text-sm mt-1">Manage and collaborate on your workspaces.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/25">
                        <i className="ri-add-line text-lg group-hover:rotate-90 transition-transform duration-300"></i>
                        New Project
                    </button>
                </div>

                {project.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
                        <div className="w-20 h-20 mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                            <i className="ri-folder-add-line text-4xl text-gray-500"></i>
                        </div>
                        <h3 className="text-xl font-medium text-gray-200 mb-2">No projects yet</h3>
                        <p className="text-gray-500 max-w-md mb-6">You haven't created any DevSync workspaces. Create your first project to start collaborating with AI and your team.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg font-medium transition-all">
                            Create First Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {project.map((project) => (
                            <div key={project._id}
                                onClick={() => {
                                    navigate(`/project`, {
                                        state: { project }
                                    })
                                }}
                                className="group flex flex-col justify-between p-6 bg-gray-900 border border-gray-800 rounded-2xl cursor-pointer hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] transition-all duration-300 h-48 relative overflow-hidden">
                                
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                                            <i className="ri-layout-masonry-line text-blue-400"></i>
                                        </div>
                                        <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-blue-400 transition-colors"></i>
                                    </div>
                                    <h2 className="font-semibold text-lg text-gray-100 group-hover:text-white transition-colors truncate">
                                        {project.name}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-800/50">
                                    <div className="flex -space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-gray-900 flex items-center justify-center text-xs font-bold ring-2 ring-gray-900">U</div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium ml-2 flex items-center gap-1">
                                        <i className="ri-group-line"></i> {project.users.length} Collaborator{project.users.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                        <h2 className="text-2xl font-bold text-white mb-2">Create New Project</h2>
                        <p className="text-gray-400 text-sm mb-6">Give your new workspace a name to get started.</p>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName || ''}
                                    type="text" 
                                    className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-600" 
                                    placeholder="e.g. My Awesome App"
                                    required 
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    className="px-5 py-2.5 bg-transparent hover:bg-gray-800 text-gray-300 rounded-lg font-medium transition-colors" 
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/25 transition-all"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home