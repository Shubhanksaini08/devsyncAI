import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const UserAuth = ({ children }) => {
    const { user, setUser } = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        if (!user) {
            axios.get('/users/profile').then(res => {
                setUser(res.data.user)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/login')
            })
        } else {
            setLoading(false)
        }

    }, [token, user, navigate, setUser])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                 <div className="flex flex-col items-center">
                     <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin mb-4"></i>
                     <p className="text-gray-400 text-sm">Authenticating...</p>
                 </div>
            </div>
        )
    }

    return (
        <>{children}</>
    )
}

export default UserAuth