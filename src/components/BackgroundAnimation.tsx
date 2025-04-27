
import React from "react";

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-purple/20 rounded-full filter blur-3xl animate-pulse-slow" />
      <div className="absolute top-2/3 -right-20 w-96 h-96 bg-brand-magenta/20 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: "-2s" }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-blue/20 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: "-4s" }} />
    </div>
  );
};

export default BackgroundAnimation;
