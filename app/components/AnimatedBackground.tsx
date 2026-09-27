"use client";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse top-1/2 left-1/2"></div>
    </div>
  );
}