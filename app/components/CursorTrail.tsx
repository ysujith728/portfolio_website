"use client";

import { useEffect } from "react";

export default function CursorTrail() {
  useEffect(() => {
    const letters = ["C", "+", "{", "}", "0", "1", "<", ">", "/", "*"];

    // 🔹 FLOWING TRAIL ON MOUSE MOVE
    const handleMove = (e: MouseEvent) => {
      const span = document.createElement("span");
      span.innerText =
        letters[Math.floor(Math.random() * letters.length)];

      span.style.position = "fixed";
      span.style.left = e.clientX + "px";
      span.style.top = e.clientY + "px";
      span.style.color = "#a855f7";
      span.style.fontSize = "16px";
      span.style.fontWeight = "bold";
      span.style.pointerEvents = "none";
      span.style.zIndex = "9999";
      span.style.transition = "all 0.6s ease-out";
      span.style.opacity = "1";

      document.body.appendChild(span);

      setTimeout(() => {
        span.style.transform = "translateY(-20px)";
        span.style.opacity = "0";
      }, 10);

      setTimeout(() => {
        span.remove();
      }, 600);
    };

    // 🔹 BURST EFFECT ON CLICK
    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 12; i++) {
        const span = document.createElement("span");
        span.innerText =
          letters[Math.floor(Math.random() * letters.length)];

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 60 + 20;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        span.style.position = "fixed";
        span.style.left = e.clientX + "px";
        span.style.top = e.clientY + "px";
        span.style.color = "#60a5fa";
        span.style.fontSize = "18px";
        span.style.fontWeight = "bold";
        span.style.pointerEvents = "none";
        span.style.zIndex = "9999";
        span.style.transition = "all 0.8s ease-out";
        span.style.opacity = "1";

        document.body.appendChild(span);

        setTimeout(() => {
          span.style.transform = `translate(${x}px, ${y}px)`;
          span.style.opacity = "0";
        }, 10);

        setTimeout(() => {
          span.remove();
        }, 800);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}