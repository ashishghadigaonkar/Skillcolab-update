import React from "react";

interface ProfileClickableProps {
  userId?: string;
  username?: string;
  className?: string;
  children: React.ReactNode;
}

export const ProfileClickable: React.FC<ProfileClickableProps> = ({
  userId,
  username,
  className = "",
  children
}) => {
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let idToNavigate = userId;

    if (!idToNavigate && username) {
      try {
        // Retrieve standard user doc from backend by username
        const response = await fetch(`/api/users/username/${encodeURIComponent(username)}`);
        if (response.ok) {
          const user = await response.json();
          if (user && user.id) {
            idToNavigate = user.id;
          }
        }
      } catch (err) {
        console.error("Failed to fetch user by username:", err);
      }
    }

    if (idToNavigate) {
      if ((window as any).viewUserProfile) {
        (window as any).viewUserProfile(idToNavigate);
      } else {
        console.warn("viewUserProfile not registered in current window context.");
      }
    } else if (username) {
      if ((window as any).viewUserProfile) {
        (window as any).viewUserProfile(username);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer hover:opacity-90 transition-opacity inline-block ${className}`}
      id={`profile_clickable_${userId || username || "gen"}`}
    >
      {children}
    </div>
  );
};
