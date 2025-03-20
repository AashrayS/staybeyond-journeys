
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AuthNavigation = () => {
  const { user, profile, signOut, isHost } = useAuth();
  
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link to="/auth">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link to="/auth?tab=signup">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isHost && (
        <Link to="/add-property">
          <Button variant="outline" size="sm">
            List Property
          </Button>
        </Link>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User"} />
              <AvatarFallback>{getInitials(profile?.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/profile" className="w-full">Profile</Link>
          </DropdownMenuItem>
          {isHost ? (
            <DropdownMenuItem>
              <Link to="/my-properties" className="w-full">My Properties</Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link to="/add-property" className="w-full">Become a Host</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Link to="/bookings" className="w-full">My Bookings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthNavigation;
