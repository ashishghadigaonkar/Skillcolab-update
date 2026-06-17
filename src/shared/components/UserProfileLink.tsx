import React from "react";

interface UserProfileLinkProps {
  userId: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  showAvatar?: boolean;
  showName?: boolean;
  avatarClassName?: string;
  textClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

export const UserProfileLink: React.FC<UserProfileLinkProps> = ({
  userId,
  name,
  username,
  avatarUrl,
  showAvatar = false,
  showName = false,
  avatarClassName = "w-6 h-6 rounded-full border border-slate-850 object-cover shrink-0",
  textClassName = "font-bold text-white hover:underline cursor-pointer transition-colors",
  className = "inline-flex items-center gap-1.5",
  children
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    
    // Check if there is global viewUserProfile registry
    if ((window as any).viewUserProfile) {
      (window as any).viewUserProfile(userId);
    } else {
      console.warn("viewUserProfile method is not registered on window");
    }
  };

  return (
    <div onClick={handleClick} className={`${className} cursor-pointer`} id={`user-link-${userId}`}>
      {children ? (
        children
      ) : (
        <>
          {showAvatar && (avatarUrl || name) && (
            <img
              src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "U")}`}
              alt={name || "User Avatar"}
              className={`${avatarClassName}`}
              referrerPolicy="no-referrer"
            />
          )}
          {showName && (
            <span className={textClassName}>
              {name || (username ? `@${username}` : "Anonymous")}
            </span>
          )}
        </>
      )}
    </div>
  );
};
