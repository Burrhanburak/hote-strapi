"use client";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

const Dropdown = ({
  user,
  isUserAuthenticated,
}: {
  user: any;
  isUserAuthenticated: boolean;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="text-muted-foreground curser-pointer">
          {isUserAuthenticated ? (
            <Avatar className="mr-2">
              <AvatarImage
                src={user?.picture}
                alt={`${user?.given_name} ${user?.family_name}`}
              />
            </Avatar>
          ) : (
            <User className="h-6 w-6" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {isUserAuthenticated ? (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem key="avatar">
                {user?.picture ? (
                  <Avatar className="mr-2">
                    <AvatarImage
                      src={user?.picture}
                      alt={`${user?.given_name} ${user?.family_name}`}
                    />
                    <AvatarFallback>{user?.given_name?.[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="mr-2 h-4 w-4" />
                )}
                {user?.given_name} {user?.family_name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem key="dashboard">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Settings className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem key="profile">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <LogoutLink postLogoutRedirectURL="/"> Logout</LogoutLink>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem key="login">
              <Link href="/login" className="flex items-center gap-2">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem key="register">
              <Link href="/register" className="flex items-center gap-2">
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem key="forgot-password">
              <Link href="/forgot-password" className="flex items-center gap-2">
                <Mail className="mr-2 h-4 w-4" />
                Forgot Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem key="support">
              <Link href="/support" className="flex items-center gap-2">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Support
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
