"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  useEffect(() => {
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!thumb || !track) return;

    const THUMB_MIN_HEIGHT = 40; // px
    let rafId: number | null = null;
    let thumbVisible = false;

    const updateThumb = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const trackH = track.clientHeight;

      // Thumb height proportional to viewport vs total content
      const ratio = clientHeight / scrollHeight;
      const thumbH = Math.max(THUMB_MIN_HEIGHT, ratio * trackH);

      // Thumb position
      const maxScroll = scrollHeight - clientHeight;
      const maxThumbTop = trackH - thumbH;
      const thumbTop =
        maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0;

      gsap.set(thumb, { height: thumbH, y: thumbTop });

      // Toggle track visibility only when needed.
      if (scrollHeight <= clientHeight) {
        track.style.opacity = "0";
      } else {
        track.style.opacity = "1";
      }
    };

    const scheduleUpdateThumb = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateThumb();
      });
    };

    // Fade in/out on scroll activity
    let fadeTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      scheduleUpdateThumb();
      if (!thumbVisible) {
        thumbVisible = true;
        gsap.to(thumb, { opacity: 1, duration: 0.15, overwrite: "auto" });
      }
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        if (!isDragging.current) {
          thumbVisible = false;
          gsap.to(thumb, { opacity: 0.45, duration: 0.6, overwrite: "auto" });
        }
      }, 1200);
    };

    // ── Drag support ──
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      dragStartY.current = e.clientY;
      dragStartScroll.current = window.scrollY;
      document.body.style.userSelect = "none";
      gsap.to(thumb, { opacity: 1, scaleX: 1.3, duration: 0.15 });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const trackH = track.clientHeight;
      const thumbH = thumb.clientHeight;
      const maxThumbTop = trackH - thumbH;
      const maxScroll = scrollHeight - clientHeight;

      const deltaY = e.clientY - dragStartY.current;
      const deltaScroll = (deltaY / maxThumbTop) * maxScroll;

      window.scrollTo({
        top: dragStartScroll.current + deltaScroll,
        behavior: "instant",
      });
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.userSelect = "";
      gsap.to(thumb, { scaleX: 1, duration: 0.2 });
      fadeTimer = setTimeout(() => {
        gsap.to(thumb, { opacity: 0.45, duration: 0.6 });
      }, 1200);
    };

    // ── Track click — jump scroll ──
    const onTrackClick = (e: MouseEvent) => {
      if (e.target === thumb) return;
      const rect = track.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const trackH = track.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;

      const targetScroll = (clickY / trackH) * maxScroll;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    };

    // ── Hover on track ──
    const onTrackEnter = () => gsap.to(thumb, { opacity: 1, duration: 0.2 });
    const onTrackLeave = () => {
      if (!isDragging.current) {
        gsap.to(thumb, { opacity: 0.45, duration: 0.4 });
      }
    };

    updateThumb();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateThumb);
    thumb.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    track.addEventListener("click", onTrackClick);
    track.addEventListener("mouseenter", onTrackEnter);
    track.addEventListener("mouseleave", onTrackLeave);

    return () => {
      clearTimeout(fadeTimer);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateThumb);
      thumb.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      track.removeEventListener("click", onTrackClick);
      track.removeEventListener("mouseenter", onTrackEnter);
      track.removeEventListener("mouseleave", onTrackLeave);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="fixed top-0 right-0 bottom-0 z-300 hidden md:flex"
      style={{ width: "10px", padding: "4px 2px", cursor: "default" }}
    >
      {/* Thumb */}
      <div
        ref={thumbRef}
        className="w-full rounded-full cursor-grab active:cursor-grabbing"
        style={{
          background: "linear-gradient(180deg, #4A90E2 0%, #17409A 100%)",
          opacity: 0.45,
          minHeight: "40px",
          position: "absolute",
          left: "2px",
          right: "2px",
          width: "calc(100% - 4px)",
          transformOrigin: "center",
          boxShadow: "0 2px 8px rgba(23, 64, 154, 0.35)",
        }}
      />
    </div>
  );
}
