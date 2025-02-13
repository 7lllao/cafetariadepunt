document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('section');
    const indicator = document.querySelector('.indicator');
    const navLinks = document.querySelectorAll('.navigation a');
    const navHeight = document.querySelector('.sticky-nav').offsetHeight;
    const headerHeight = document.querySelector('.sticky-header').offsetHeight;

    const offset = headerHeight - 10; // Extra 10px voor speling
    const maxMovement = 5; // Maximum pixels the indicator can move left/right
    const sectionTransitionThreshold = .9; // When to switch to next section (80%)

    const moveIndicatorToLink = (link, scrollOffset = 0) => {
        const linkRect = link.getBoundingClientRect();
        const navRect = document.querySelector('.navigation').getBoundingClientRect();
        const baseOffset = linkRect.left - navRect.left + linkRect.width / 2 - indicator.offsetWidth / 2;
        
        // Add subtle movement based on scroll position
        const movement = (scrollOffset * maxMovement);
        indicator.style.left = `${baseOffset + movement}px`;
    };

    const onScroll = () => {
        const viewportCenter = window.scrollY + (window.innerHeight / 2);
        let activeSection = null;
        let minDistance = Infinity;

        // Find the section closest to the viewport center
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = section.offsetTop + (rect.height / 2);
            const distance = Math.abs(viewportCenter - sectionCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                activeSection = section;
            }
        });

        if (activeSection) {
            const rect = activeSection.getBoundingClientRect();
            const progress = (offset - rect.top) / rect.height;

            // If we're past the threshold and there's a next section, switch to it
            if (progress > sectionTransitionThreshold && activeSection.nextElementSibling) {
                const nextSection = activeSection.nextElementSibling;
                const nextLink = document.querySelector(`.navigation a[href="#${nextSection.id}"]`);
                if (nextLink) {
                    moveIndicatorToLink(nextLink, -1); // Start at the beginning of the next section
                }
            } else {
                // Calculate progress for current section
                const normalizedProgress = Math.max(-1, Math.min(1, (progress * 2) - 1));
                const currentLink = document.querySelector(`.navigation a[href="#${activeSection.id}"]`);
                if (currentLink) {
                    moveIndicatorToLink(currentLink, normalizedProgress);
                }
            }
        }
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

                // Na het scrollen updaten we handmatig de indicator
                setTimeout(() => moveIndicatorToLink(link), 300);
            }
        });
    });
});
