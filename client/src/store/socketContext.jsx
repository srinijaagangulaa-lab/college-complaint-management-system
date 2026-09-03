import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './authContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketBaseUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || window.location.origin;
    const cleanSocketUrl = socketBaseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

    const socketInstance = io(cleanSocketUrl, {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      // Join user and role specific rooms
      socketInstance.emit('join_user', user._id);
      if (user.role) {
        socketInstance.emit('join_role', user.role);
      }
    });

    socketInstance.on('notification', () => {
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id, user?.role]);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, setUnreadCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context || {};
};
