"use client";

import { useAuth, useUser } from "@/lib/auth-context";
import { Refrigerator, Cookie, User, LogOut, Settings } from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import ManageAccountModal from "./ManageAccountModal";

const UserDropdown = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isManageAccountOpen, setIsManageAccountOpen] = useState(false);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user?.imageUrl} alt={user?.email} />
          <AvatarFallback className="bg-orange-600 text-white text-xs">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">
            {user?.firstName || "User"} {user?.lastName || ""}
          </p>
          <p className="text-xs text-stone-500">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/recipes" className="cursor-pointer flex items-center">
            <Cookie className="mr-2 h-4 w-4" />
            My Recipes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/pantry" className="cursor-pointer flex items-center">
            <Refrigerator className="mr-2 h-4 w-4" />
            My Pantry
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsManageAccountOpen(true);
          }}
          className="cursor-pointer flex items-center"
        >
          <Settings className="mr-2 h-4 w-4" />
          Manage account
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={signOut}
          className="cursor-pointer text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ManageAccountModal
        isOpen={isManageAccountOpen}
        onClose={() => setIsManageAccountOpen(false)}
      />
    </DropdownMenu>
  );
};

export default UserDropdown;

