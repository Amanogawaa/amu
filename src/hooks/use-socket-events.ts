'use client';

import { useEffect } from 'react';
import { useSocket } from '@/provider/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/loggers';

interface SocketEventHandlers {
  resourceType: 'course' | 'module' | 'lesson' | 'chapter';
  queryKey: string[];
}

export const useResourceEvents = ({
  resourceType,
  queryKey,
}: SocketEventHandlers) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const eventName = `${resourceType}:created`;

    socket.on(eventName, (data: any) => {
      queryClient.invalidateQueries({ queryKey });

      toast.success(
        `${resourceType.slice(0, -1).toUpperCase()} created successfully`
      );
    });

    return () => {
      socket.off(eventName);
    };
  }, [socket, isConnected, resourceType, queryKey]);
};

export const useCourseRoom = (courseId: string | null) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !courseId) return;

    // Join course room
    socket.emit('course:join', courseId);

    // Listen for confirmation
    socket.on('course:joined', (data) => {
      logger.log('Joined course room:', data.courseId);
    });

    return () => {
      // Leave course room on cleanup
      socket.emit('course:leave', courseId);
      socket.off('course:joined');
    };
  }, [socket, isConnected, courseId]);

  return { socket, isConnected };
};

export const useModuleRoom = (moduleId: string | null) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !moduleId) return;

    socket.emit('module:join', moduleId);

    socket.on('module:joined', (data) => {
      logger.log('Joined module room:', data.moduleId);
    });

    return () => {
      socket.emit('module:leave', moduleId);
      socket.off('module:joined');
    };
  }, [socket, isConnected, moduleId]);

  return { socket, isConnected };
};

export const useProgressTracker = () => {
  const { socket, isConnected } = useSocket();

  const updateProgress = (lessonId: string, progress: number) => {
    if (!socket || !isConnected) {
      logger.warn('Socket not connected, cannot update progress');
      return;
    }

    socket.emit('progress:lesson', { lessonId, progress });
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('progress:updated', (data) => {
      logger.log('Progress updated:', data);
    });

    return () => {
      socket.off('progress:updated');
    };
  }, [socket, isConnected]);

  return { updateProgress, socket, isConnected };
};

export const useCommentListener = (
  resourceType: string,
  resourceId: string,
  onNewComment?: (comment: any) => void
) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !resourceId) return;

    // Join the resource room (course, module, lesson, etc.)
    socket.emit(`${resourceType}:join`, resourceId);

    // Listen for new comments
    socket.on('comment:created', (data) => {
      logger.log('New comment received:', data);
      if (onNewComment) {
        onNewComment(data.comment);
      }
    });

    return () => {
      socket.emit(`${resourceType}:leave`, resourceId);
      socket.off('comment:created');
    };
  }, [socket, isConnected, resourceType, resourceId, onNewComment]);

  return { socket, isConnected };
};
