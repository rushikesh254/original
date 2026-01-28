/**
 * MANAGE ACCOUNT MODAL
 * This is the big popup where users can change their name, 
 * update their password, or look at their billing.
 */
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/lib/auth-context"; // To get and update user data
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Shield,
  CreditCard,
  Mail,
  MoreHorizontal,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import PricingModal from "./PricingModal";

export default function ManageAccountModal({ isOpen, onClose }) {
  const { user, updateProfile, changePassword } = useUser();
  const [activeTab, setActiveTab] = useState("profile"); // Tracks which tab is open (Profile/Security/Billing)
  const [loading, setLoading] = useState(false);

  // --- 1. FORM STATE (For Name Updates) ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  // Pull existing user name into the form when the modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user, isOpen]);

  // --- 2. PASSWORD CHANGE STATE ---
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * HANDLE PASSWORD CHANGE
   * Validation checks + API call to change password.
   */
  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success("Password updated successfully");
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLE UPDATE PROFILE
   * Saves the new first/last names.
   */
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Helper to show initials if no avatar image
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  // List of items for the left-side sidebar
  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full md:w-fit max-w-[95vw] md:max-w-5xl p-0 gap-0 overflow-hidden h-[90vh] md:h-[600px] flex flex-col md:flex-row sm:rounded-2xl">
        
        {/* SIDEBAR (Left Side on Desktop, Top on Mobile) */}
        <div className="w-full md:w-64 bg-stone-50 border-b md:border-b-0 md:border-r border-stone-200 p-4 md:p-6 flex flex-col shrink-0">
          <div className="mb-4 md:mb-8 pl-2">
            <h2 className="font-bold text-xl text-stone-900">Account</h2>
            <p className="text-sm text-stone-500">Manage your account info.</p>
          </div>

          <div className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                  activeTab === item.id
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                    : "text-stone-600 hover:bg-stone-100/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT AREA (Right Side) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white">
          <div className="w-full md:min-w-[500px] lg:min-w-[600px] mx-auto md:mx-0">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-xl font-bold text-stone-900 capitalize">
                {activeTab} details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* --- 1. PROFILE TAB --- */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Profile Picture & Name */}
                <div className="flex items-start gap-6 pb-8 border-b border-stone-100">
                  <div className="w-24 font-medium text-stone-500 pt-2">
                    Profile
                  </div>
                  <div className="flex-1 flex gap-4 items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback className="bg-orange-600 text-white text-xl">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <p className="font-medium text-stone-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <div className="flex gap-3">
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="First Name"
                          className="h-9 text-sm"
                        />
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Last Name"
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      variant="outline"
                      className="h-9"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Update profile"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Email (Static for now) */}
                <div className="flex items-start gap-6 pb-8 border-b border-stone-100">
                  <div className="w-24 font-medium text-stone-500 pt-2">
                    Email addresses
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-stone-500" />
                        <span className="text-sm text-stone-900">
                          {user?.email}
                        </span>
                        <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                          Primary
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="w-4 h-4 text-stone-400" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-stone-600 border-dashed border-stone-300 hover:border-stone-400 hover:bg-stone-50"
                      onClick={() =>
                        toast.info("This feature is coming soon!")
                      }
                    >
                      + Add email address
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* --- 2. BILLING TAB --- */}
            {activeTab === "billing" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-start gap-6 pb-8 border-b border-stone-100">
                  <div className="w-24 font-medium text-stone-500 pt-2">
                    Subscription
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-stone-200 rounded-lg bg-stone-50/50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg text-stone-900 capitalize">
                            {user?.subscriptionTier || "Free"} Plan
                          </span>
                          {user?.subscriptionTier === "pro" && (
                            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-stone-500 text-sm">
                          {user?.subscriptionTier === "pro"
                            ? "$9.99 / month"
                            : "$0.00 / month"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-stone-900">
                          {user?.subscriptionTier === "pro" ? "$9.99" : "$0"}
                        </div>
                      </div>
                    </div>
                    
                    {/* Switch Plans Button (Opens another Modal) */}
                    <PricingModal subscriptionTier={user?.subscriptionTier}>
                       <Button
                        variant="outline"
                        className="w-full justify-between group hover:border-orange-200 hover:bg-orange-50"
                       >
                        <span className="font-medium text-stone-700 group-hover:text-orange-700 flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Switch plans
                        </span>
                      </Button>
                    </PricingModal>
                   
                  </div>
                </div>
              </div>
            )}

            {/* --- 3. SECURITY TAB --- */}
            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-start gap-6 pb-8 border-b border-stone-100">
                  <div className="w-24 font-medium text-stone-500 pt-2">
                    Password
                  </div>
                  <div className="flex-1 space-y-4">
                    {!isChangingPassword ? (
                      // VIEW MODE
                      <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl tracking-widest text-stone-400">
                            ••••••••••••
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsChangingPassword(true)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      // EDIT MODE (The Form)
                      <div className="space-y-4 p-4 border border-orange-200 rounded-lg bg-orange-50/30">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-stone-500 uppercase">
                            Current Password
                          </label>
                          <Input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="h-9 text-sm"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-stone-500 uppercase">
                            New Password
                          </label>
                          <Input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="h-9 text-sm"
                            placeholder="Min. 8 characters"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-stone-500 uppercase">
                            Confirm New Password
                          </label>
                          <Input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="h-9 text-sm"
                            placeholder="Re-type new password"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={handlePasswordChange}
                            disabled={loading}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            {loading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Save Password"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setPasswordData({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
