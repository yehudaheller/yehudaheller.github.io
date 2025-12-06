// select all project videos inside project-vidbox so code is robust
const projectVideos = Array.from(document.querySelectorAll('.project-vidbox video'));

// Sidebar elements (guard against missing elements)
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

const hoverSign = document.querySelector('.hover-sign');

// Play on hover, but do NOT pause on mouseout — videos should keep playing
projectVideos.forEach(function(video){
    if(!video) return;
    video.addEventListener('mouseover', function(){
        // attempt to play (video elements already set to autoplay muted)
        video.play().catch(()=>{});
        if(hoverSign) hoverSign.classList.add('active');
    });
    video.addEventListener('mouseout', function(){
        // keep playing; only remove hover sign indicator
        if(hoverSign) hoverSign.classList.remove('active');
    });
});

// Sidebar elements (add guards)
if(menu && sideBar){
    menu.addEventListener('click', function(){
        sideBar.classList.remove('close-sidebar');
        sideBar.classList.add('open-sidebar');
    });
}

if(closeIcon && sideBar){
    closeIcon.addEventListener('click', function(){
        sideBar.classList.remove('open-sidebar');
        sideBar.classList.add('close-sidebar');
    });
}
