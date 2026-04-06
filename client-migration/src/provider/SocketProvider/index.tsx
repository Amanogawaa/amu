'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { auth } from '@/utils/firebase';
import { logger } from '@/lib/loggers';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const initializeSocket = async () => {
      if (isInitializedRef.current) {
        logger.debug('Socket already initialized, skipping re-initialization');
        return;
      }

      if (socketRef.current) {
        logger.debug(
          'Socket instance already exists, skipping re-initialization'
        );
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      isInitializedRef.current = true;

      try {
        const user = auth.currentUser;
        if (!user) {
          logger.log('No authenticated user, skipping socket connection');
          return;
        }

        const token = await user.getIdToken();

        const socketInstance = io(
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
          {
            auth: {
              token: token,
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000,
          }
        );

        socketInstance.on('connect', () => {
          logger.log('Socket connected:', socketInstance.id);
          setIsConnected(true);
        });

        socketInstance.on('disconnect', (reason) => {
          logger.log('Socket disconnected:', reason);
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          logger.error('Socket connection error:', error);
          setIsConnected(false);
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);
      } catch (error) {
        logger.error('Failed to initialize socket:', error);
      } finally {
        isInitializedRef.current = false;
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        initializeSocket();
      } else {
        if (socketRef.current) {
          logger.debug('User logged out, disconnecting socket');
          socketRef.current.disconnect();
          socketRef.current = null;
          setSocket(null);
          setIsConnected(false);
        }
      }
    });

    return () => {
      unsubscribe();
      if (socket) {
        logger.debug('Cleaning up socket on unmount');
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
