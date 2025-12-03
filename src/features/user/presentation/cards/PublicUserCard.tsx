import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { User2Icon } from 'lucide-react';
import Link from 'next/link';

interface PublicUserCardProps {
  userId: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  email?: string;
  className?: string;
}

/**
 * PublicUserCard - A clickable card component that displays user information
 * and links to their public profile page
 *
 * @example
 * <PublicUserCard
 *   userId="user123"
 *   firstName="John"
 *   lastName="Doe"
 *   photoURL="https://example.com/photo.jpg"
 * />
 */
export function PublicUserCard({
  userId,
  firstName,
  lastName,
  photoURL,
  email,
  className = '',
}: PublicUserCardProps) {
  const displayName =
    firstName || lastName
      ? `${firstName || ''} ${lastName || ''}`.trim()
      : 'Anonymous User';

  const initials = firstName?.[0] || lastName?.[0] || email?.[0] || 'U';

  return (
    <Link href={`/account/${userId}`} className={className}>
      <Card className="hover:bg-accent transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={photoURL || '/profile_1'} alt={displayName} />
              <AvatarFallback className="text-lg">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{displayName}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User2Icon className="h-3 w-3" />
                <span className="truncate">View Profile</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
