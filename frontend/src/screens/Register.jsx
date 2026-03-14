import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const Register = () => {

    const [ name, setName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()


    function submitHandler(e) {

        e.preventDefault()

        axios.post('/users/register', {
            name,
            email,
            password
        }).then((res) => {
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            navigate('/')
        }).catch((err) => {
            console.log(err.response.data)
        })
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.1)] border border-gray-800 w-full max-w-md backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Create Account</h2>
                    <p className="text-gray-400 mt-2 text-sm">Join DevSync AI today</p>
                </div>
                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="name">Full Name</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            id="name"
                            className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-500"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="email">Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-500"
                            placeholder="Choose a password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register