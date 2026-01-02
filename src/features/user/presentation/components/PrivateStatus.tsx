'use client'

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Eye, Shield, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PrivateStatusProps {
  userName?: string;
  className?: string;
}

const PrivateStatus = ({ userName, className = '' }: PrivateStatusProps) => {
  const router = useRouter();

  return (
    <div
      className={`flex items-center justify-center min-h-[60vh] pt-10 ${className}`}
    >
      <Card className="max-w-2xl w-full mx-4 border-2 border-muted">
        <CardContent className="pt-12 pb-12 px-6 md:px-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon Group */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
                <Lock className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                This Account is Private
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
                {userName ? (
                  <>
                    <span className="font-semibold text-foreground">
                      {userName}
                    </span>{' '}
                    has chosen to keep their profile private
                  </>
                ) : (
                  'This user has chosen to keep their profile private'
                )}
              </p>
            </div>

            {/* Privacy Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 border border-border">
                <Shield
                  className="w-6 h-6 text-primary mb-2"
                  strokeWidth={1.5}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Profile Protected
                </p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 border border-border">
                <Eye className="w-6 h-6 text-primary mb-2" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground text-center">
                  Limited Visibility
                </p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 border border-border">
                <UserX
                  className="w-6 h-6 text-primary mb-2"
                  strokeWidth={1.5}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Access Restricted
                </p>
              </div>
            </div>

            {/* Information Box */}
            <div className="w-full mt-6 p-6 rounded-lg bg-muted/30 border border-border space-y-3">
              <h3 className="font-semibold text-sm text-foreground">
                What does this mean?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    This user's profile information is not publicly visible
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Their courses, analytics, and activity are hidden</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Only they can view their full profile</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mt-6 min-w-[200px]"
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivateStatus;
