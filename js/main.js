document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('section');
    const indicator = document.querySelector('.indicator');
    const navLinks = document.querySelectorAll('.navigation a');
    const navHeight = document.querySelector('.sticky-nav').offsetHeight;
    const headerHeight = document.querySelector('.sticky-header').offsetHeight;

    const offset = headerHeight - 10; // Extra 10px voor speling
    const maxMovement = 7; // Maximum pixels the indicator can move left/right

    const moveIndicatorToLink = (link, scrollOffset = 0) => {
        const linkRect = link.getBoundingClientRect();
        const navRect = document.querySelector('.navigation').getBoundingClientRect();
        const baseOffset = linkRect.left - navRect.left + linkRect.width / 2 - indicator.offsetWidth / 2;
        
        // Add subtle movement based on scroll position
        const movement = (scrollOffset * maxMovement);
        indicator.style.left = `${baseOffset + movement}px`;
    };

    const onScroll = () => {
        let currentSection = null;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= offset && rect.bottom >= offset) {
                currentSection = section;
                
                // Calculate how far through the section we are (-1 to 1)
                const sectionProgress = (offset - rect.top) / rect.height;
                const normalizedProgress = Math.max(-1, Math.min(1, (sectionProgress * 2) - 1));
                
                const currentLink = document.querySelector(`.navigation a[href="#${section.id}"]`);
                if (currentLink) moveIndicatorToLink(currentLink, normalizedProgress);
            }
        });
    };

    // Init indicator position
    moveIndicatorToLink(navLinks[0]);

    window.addEventListener('scroll', onScroll);

    // Smooth scroll met offset bij klikken
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const targetPosition = targetSection.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Na het scrollen updaten we handmatig de indicator (voor als je bijv. snel klikt)
                setTimeout(() => moveIndicatorToLink(link), 300);
            }
        });
    });
});