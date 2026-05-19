import { createContext, useContext, useEffect, useState, useRef } from 'react';
import supabase from '../lib/supabase';
import { useAuth } from './AuthContext';

const RealtimeContext = createContext();

export const useRealtime = () => useContext(RealtimeContext);

// Backward compat: keep useSocket alias
export const useSocket = () => useContext(RealtimeContext);

export const RealtimeProvider = ({ children }) => {
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!user || !user.societyId) {
      if (channel) {
        supabase.removeChannel(channel);
        setChannel(null);
      }
      return;
    }

    const societyId = user.societyId?._id || user.societyId;

    // Create a channel that listens to changes in this society's data
    const ch = supabase
      .channel(`society-${societyId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payments',
        filter: `society_id=eq.${societyId}`
      }, (payload) => {
        window.dispatchEvent(new CustomEvent('payment_updated', { detail: payload }));
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payment_requests',
        filter: `society_id=eq.${societyId}`
      }, (payload) => {
        window.dispatchEvent(new CustomEvent('payment_request_updated', { detail: payload }));
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `society_id=eq.${societyId}`
      }, (payload) => {
        window.dispatchEvent(new CustomEvent('new_notification', { detail: payload }));
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'fund_payments',
        filter: `society_id=eq.${societyId}`
      }, (payload) => {
        window.dispatchEvent(new CustomEvent('fund_payment_updated', { detail: payload }));
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'flats',
        filter: `society_id=eq.${societyId}`
      }, (payload) => {
        window.dispatchEvent(new CustomEvent('flat_updated', { detail: payload }));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('🟢 Supabase Realtime connected for society:', societyId);
        }
      });

    setChannel(ch);

    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);

  const handlersMapRef = useRef(new Map());

  // Provide a backward-compatible emit-like interface
  // Components that used socket.on('event', handler) can now use window events
  const realtimeValue = {
    on: (event, handler) => {
      const wrapper = (e) => handler(e.detail);
      handlersMapRef.current.set(handler, wrapper);
      window.addEventListener(event, wrapper);
      return () => {
        window.removeEventListener(event, wrapper);
        handlersMapRef.current.delete(handler);
      };
    },
    off: (event, handler) => {
      const wrapper = handlersMapRef.current.get(handler);
      if (wrapper) {
        window.removeEventListener(event, wrapper);
        handlersMapRef.current.delete(handler);
      }
    },
    connected: !!channel
  };

  return (
    <RealtimeContext.Provider value={realtimeValue}>
      {children}
    </RealtimeContext.Provider>
  );
};

