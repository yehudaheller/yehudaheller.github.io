/**
 * Yehuda Heller — Portfolio Javascript Functionality
 * Manages video playback controls, glassmorphic interactive behaviors,
 * mouse-tracking cosmic glows, and mobile nav drawer actions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. PROJECT VIDEOS AUTOPLAY
    // Select all project videos inside project-vidbox and project-vidbox-split
    const projectVideos = Array.from(document.querySelectorAll('.project-vidbox video, .project-vidbox-split video'));

    projectVideos.forEach((video) => {
        if (!video) return;
        
        // Ensure videos are playing by default (standard browser compatibility check)
        video.play().catch(() => {});

        video.addEventListener('mouseover', () => {
            // Keep playing when hovered
            video.play().catch(() => {});
        });
    });

    // 2. INTERACTIVE AMBIENT MOUSE GLOW
    const mouseGlow = document.getElementById('mouseGlow');
    if (mouseGlow) {
        // Track mouse position smoothly with light resource usage
        window.addEventListener('mousemove', (e) => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        }, { passive: true });
    }

    // 3. MOBILE SIDEBAR DRAWER MANAGEMENT
    const sideBar = document.querySelector('.sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    if (menuIcon && sideBar) {
        menuIcon.addEventListener('click', () => {
            sideBar.classList.remove('close-sidebar');
            sideBar.classList.add('open-sidebar');
        });
    }

    if (closeIcon && sideBar) {
        closeIcon.addEventListener('click', () => {
            sideBar.classList.remove('open-sidebar');
            sideBar.classList.add('close-sidebar');
        });
    }

    // Auto-close mobile drawer when any link is clicked
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    sidebarLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (sideBar && sideBar.classList.contains('open-sidebar')) {
                sideBar.classList.remove('open-sidebar');
                sideBar.classList.add('close-sidebar');
            }
        });
    });
});
