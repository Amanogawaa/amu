'use client';

import { useSocket } from '@/provider/SocketProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface Notification {
  type: string;
  message: string;
  timestamp: string;
}

export function SocketTestPanel() {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for notifications
    socket.on('notification', (data: Notification) => {
      console.log('Received notification:', data);
      setNotifications((prev) => [data, ...prev].slice(0, 10)); // Keep last 10
    });

    return () => {
      socket.off('notification');
    };
  }, [socket, isConnected]);

  const testBroadcast = () => {
    if (!socket || !isConnected) {
      alert('Socket not connected!');
      return;
    }

    // This would typically be done from the backend
    console.log('Socket connected, ID:', socket.id);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Socket.IO Test Panel</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            {socket && isConnected && (
              <Badge variant="outline" className="text-xs">
                ID: {socket.id?.slice(0, 8)}...
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testBroadcast} disabled={!isConnected}>
            Test Connection
          </Button>
          <Button
            onClick={clearNotifications}
            variant="outline"
            disabled={notifications.length === 0}
          >
            Clear Notifications
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Recent Notifications:</h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No notifications yet. Test endpoints from your API or wait for
              real-time events.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map((notif, index) => (
                <div key={index} className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-1">
                        {notif.type}
                      </Badge>
                      <p className="text-sm">{notif.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(notif.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-sm mb-2">Test with API:</h3>
          <div className="space-y-1 text-xs text-muted-foreground font-mono bg-muted p-3 rounded">
            <p>GET /api/socket/test/broadcast?message=Hello</p>
            <p>GET /api/socket/test/user/:userId?message=Hello</p>
            <p>GET /api/socket/test/course/:courseId?message=Hello</p>
            <p>GET /api/socket/stats</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
