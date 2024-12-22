import React from "react";

interface PopNotificationProps {
  value: React.ReactNode;
  hidden?: boolean;
  children: React.ReactNode;
}

export const PopNotification: React.FC<PopNotificationProps> = ({ value, hidden, children }) => {
  return (
    <div className="relative w-fit h-fit">
      {children}

      {!hidden && (
        <div className="absolute -top-0 -right-0.5 bg-primary text-[0.5rem] w-3 h-3 font-medium rounded-md flex items-center justify-center text-foreground select-none pointer-events-none">
          {value}
        </div>
      )}
    </div>
  );
};
