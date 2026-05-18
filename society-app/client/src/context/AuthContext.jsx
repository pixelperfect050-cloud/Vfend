import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';
import { getCurrentProfile } from '../lib/database';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      const profile = await getCurrentProfile();
      if (profile) {
        // Map Supabase profile to the existing user shape the UI expects
        setUser({
          id: profile.id,
          _id: profile.id, // backward compat
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
          status: profile.status,
          residentType: profile.resident_type,
          avatar: profile.avatar,
          isActive: profile.is_active,
          societyId: profile.society ? profile.society : (profile.society_id || null),
          flatId: profile.flat ? profile.flat : (profile.flat_id || null),
          // Keep nested objects for pages that use societyId._id pattern
          ...(profile.society && { societyId: { _id: profile.society.id, ...profile.society } }),
          ...(profile.flat && { flatId: { _id: profile.flat.id, ...profile.flat } })
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session load failed:', err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await loadUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Visibility-based session refresh (fixes mobile background tab issues)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadUser();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      setError('');
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (authError) throw authError;

      // Load full profile
      const profile = await getCurrentProfile();
      const mappedUser = {
        id: profile.id,
        _id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        status: profile.status,
        residentType: profile.resident_type,
        avatar: profile.avatar,
        isActive: profile.is_active,
        ...(profile.society && { societyId: { _id: profile.society.id, ...profile.society } }),
        ...(profile.flat && { flatId: { _id: profile.flat.id, ...profile.flat } })
      };
      setUser(mappedUser);
      return { token: data.session.access_token, user: mappedUser };
    } catch (err) {
      const message = err.message || 'Login failed. Please try again.';
      setError(message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const { name, email, phone, password, role, inviteCode, flatId, residentType } = userData;

      // Sign up with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone } // stored in raw_user_meta_data → trigger creates profile
        }
      });
      if (authError) throw authError;

      const userId = data.user.id;

      // Determine society_id from invite code for members
      let societyId = null;
      let status = 'approved';

      if (role === 'member' && inviteCode) {
        const { data: society, error: socErr } = await supabase
          .from('societies')
          .select('id')
          .eq('invite_code', inviteCode.toUpperCase())
          .single();
        if (socErr || !society) throw new Error('Invalid invite code');
        societyId = society.id;
        status = 'pending';
      }

      // Update the auto-created profile with role, society, flat
      await supabase
        .from('profiles')
        .update({
          role: role || 'member',
          society_id: societyId,
          flat_id: flatId || null,
          resident_type: residentType || 'none',
          status
        })
        .eq('id', userId);

      // Load full profile
      const profile = await getCurrentProfile();
      const mappedUser = {
        id: profile.id,
        _id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        status: profile.status,
        societyId: profile.society_id,
        flatId: profile.flat_id
      };
      setUser(mappedUser);
      return { token: data.session?.access_token, user: mappedUser };
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
