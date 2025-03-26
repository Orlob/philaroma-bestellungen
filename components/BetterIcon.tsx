import React from "react";

// A better way to illustrate with icons
// Pass any SVG icon as children (recommended width/height : w-6 h-6)
// By default, it's using your primary color for styling
const BetterIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-8 h-8 inline-flex items-center justify-center">
      {children}
    </div>
  );
};

export default BetterIcon;
