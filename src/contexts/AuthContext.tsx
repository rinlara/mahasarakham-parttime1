
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: any | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  register: (userData: { email: string; password: string; name: string; role: string; phone?: string; address?: string; }) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateProfile: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for test user first
        const testUser = localStorage.getItem('testUser');
        if (testUser) {
          console.log('Test user found in localStorage');
          const parsedUser = JSON.parse(testUser);
          if (mounted) {
            setUser(parsedUser);
            setIsLoading(false);
          }
          return;
        }

        console.log('Getting initial session...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }
        
        if (mounted) {
          console.log('Initial session:', initialSession?.user?.id || 'No session');
          setSession(initialSession);
          
          if (initialSession?.user) {
            console.log('Initial session found, fetching profile...');
            await fetchUserProfile(initialSession.user.id);
          } else {
            console.log('No initial session found');
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (mounted) {
          setSession(session);
          
          if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            console.log('User signed in, fetching profile...');
            // Clear test user when real user signs in
            localStorage.removeItem('testUser');
            setTimeout(() => {
              if (mounted) {
                fetchUserProfile(session.user.id);
              }
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            setUser(null);
            localStorage.removeItem('testUser');
            setIsLoading(false);
          } else if (!session && event === 'INITIAL_SESSION') {
            // Only clear user if there's no test user and no session on initial load
            const testUser = localStorage.getItem('testUser');
            if (!testUser) {
              console.log('No session and no test user, setting loading to false');
              setUser(null);
              setIsLoading(false);
            } else {
              console.log('No Supabase session but test user exists, keeping test user');
            }
          }
        }
      }
    );

    initializeAuth();

    // Listen for test user login events
    const handleTestUserLogin = () => {
      const testUser = localStorage.getItem('testUser');
      if (testUser && mounted) {
        console.log('Test user login event detected');
        const parsedUser = JSON.parse(testUser);
        setUser(parsedUser);
        setIsLoading(false);
      }
    };

    window.addEventListener('testUserLogin', handleTestUserLogin);

    return () => {
      console.log('AuthProvider: Cleaning up...');
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener('testUserLogin', handleTestUserLogin);
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      setIsLoading(true);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        console.log('Profile found:', profile);
        setUser(profile);
      } else {
        console.log('No profile found for user, creating one...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            name: 'ผู้ใช้ใหม่',
            email: '',
            role: 'applicant'
          }])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating profile:', createError);
          setUser(null);
        } else {
          console.log('Created new profile:', newProfile);
          setUser(newProfile);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('Attempting login for:', email);
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return { error };
      }

      console.log('Login successful for user:', data.user?.id);
      
      return { error: null };
    } catch (error) {
      console.error('Login catch error:', error);
      setIsLoading(false);
      return { error };
    }
  };

  const register = async (userData: { email: string; password: string; name: string; role: string; phone?: string; address?: string; }) => {
    console.log('Attempting registration for:', userData.email);
    
    try {
      setIsLoading(true);
      
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name,
            role: userData.role,
            phone: userData.phone || '',
            address: userData.address || ''
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        setIsLoading(false);
        return { error };
      }

      if (data.user) {
        console.log('Registration successful for user:', data.user.id);
        
        // Create profile immediately after successful registration
        try {
          const profileData = {
            id: data.user.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            phone: userData.phone || '',
            address: userData.address || ''
          };

          console.log('Creating profile with data:', profileData);

          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert([profileData])
            .select()
            .single();

          if (profileError) {
            console.error('Error creating profile:', profileError);
            // Don't return error here as the user was created successfully
          } else {
            console.log('Profile created successfully:', newProfile);
            setUser(newProfile);
          }
        } catch (profileError) {
          console.error('Profile creation failed:', profileError);
        }
      }
      
      setIsLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Registration catch error:', error);
      setIsLoading(false);
      return { error };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      setIsLoading(true);
      
      // Clear test user data
      localStorage.removeItem('testUser');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      setUser(null);
      setSession(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Logout catch error:', error);
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: any): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      setUser({ ...user, ...userData });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const contextValue: AuthContextType = { 
    user, 
    session, 
    login, 
    register, 
    logout, 
    isLoading, 
    updateProfile 
  };

  console.log('AuthProvider rendering - User:', user?.id, 'Loading:', isLoading);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
