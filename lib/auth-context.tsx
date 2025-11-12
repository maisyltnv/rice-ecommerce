"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"
import { registerCustomerAPI, type CustomerRegistrationRequest } from "./api"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string, phone?: string, address?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@heritagerice.com",
    name: "Admin User",
    address: {
      street: "123 Rice Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "US",
    },
  },
  {
    id: "2",
    email: "user@example.com",
    name: "John Doe",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("rice-user")
    console.log('AuthContext: Loading user from localStorage:', savedUser)
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        console.log('AuthContext: Parsed user:', user)
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        })
      } catch (error) {
        console.error("Failed to load user from localStorage:", error)
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    } else {
      console.log('AuthContext: No saved user found')
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication logic
    const user = mockUsers.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // In a real app, you'd verify the password hash
    if (password.length < 6) {
      return { success: false, error: "Invalid password" }
    }

    // Save user to localStorage and update state
    localStorage.setItem("rice-user", JSON.stringify(user))
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    })

    return { success: true }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    address?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const payload: CustomerRegistrationRequest = {
      email,
      password,
      name,
      phone: phone || "",
      address: address || "",
    }

    const response = await registerCustomerAPI(payload)

    if (!response.success || !response.customer || !response.token) {
      return {
        success: false,
        error: response.error || response.message || "Signup failed",
      }
    }

    const newUser: User = {
      id: String(response.customer.id),
      email: response.customer.email,
      name: response.customer.name,
      phone: response.customer.phone,
    }

    localStorage.setItem("rice-user", JSON.stringify(newUser))
    localStorage.setItem("auth-token", response.token)

    setState({
      user: newUser,
      isLoading: false,
      isAuthenticated: true,
    })

    return { success: true }
  }

  const logout = () => {
    // Clear all session data
    localStorage.removeItem("rice-user")
    localStorage.removeItem("auth-token")
    sessionStorage.clear()

    // Clear any cookies (if any)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })

    // Update auth state
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!state.user) return

    const updatedUser = { ...state.user, ...updates }
    localStorage.setItem("rice-user", JSON.stringify(updatedUser))
    setState((prev) => ({
      ...prev,
      user: updatedUser,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
