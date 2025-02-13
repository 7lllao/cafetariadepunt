document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('section');
    const indicator = document.querySelector('.indicator');
    const navLinks = document.querySelectorAll('.navigation a');
    const navHeight = document.querySelector('.sticky-nav').offsetHeight;
    const headerHeight = document.querySelector('.sticky-header').offsetHeight;

    const offset = headerHeight - 10;
    const maxMovement = 3;
    const sectionTransitionThreshold = 0.8;
    let isClickTransition = false;

    // Add these variables for background animation
    const indicatorColor = getComputedStyle(indicator).backgroundColor;
    const originalButtonColor = getComputedStyle(navLinks[0]).backgroundColor;
    
    // Function to check if indicator overlaps with a nav button
    const checkIndicatorOverlap = (link) => {
        const indicatorRect = indicator.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        
        // Calculate the overlap threshold (e.g., 50% overlap)
        const overlapThreshold = indicatorRect.width * 0.5;
        
        const indicatorCenter = indicatorRect.left + (indicatorRect.width / 2);
        const linkCenter = linkRect.left + (linkRect.width / 2);
        
        return Math.abs(indicatorCenter - linkCenter) < overlapThreshold;
    };

    // Function to update button backgrounds
    const updateButtonBackgrounds = () => {
        navLinks.forEach(link => {
            const isOverlapping = checkIndicatorOverlap(link);
            
            if (isOverlapping) {
                link.style.transition = 'background-color 0.3s ease';
                link.style.backgroundColor = indicatorColor;
            } else {
                link.style.transition = 'background-color 0.3s ease';
                link.style.backgroundColor = originalButtonColor;
            }
        });
    };

    const moveIndicatorToLink = (link, scrollOffset = 0) => {
        const linkRect = link.getBoundingClientRect();
        const navRect = document.querySelector('.navigation').getBoundingClientRect();
        const baseOffset = linkRect.left - navRect.left + linkRect.width / 2 - indicator.offsetWidth / 2;
        
        if (link === navLinks[navLinks.length - 1] || isClickTransition) {
            indicator.style.left = `${baseOffset}px`;
        } else {
            const movement = (scrollOffset * maxMovement);
            indicator.style.left = `${baseOffset + movement}px`;
        }

        // Update button backgrounds after indicator movement
        requestAnimationFrame(updateButtonBackgrounds);
    };

    const onScroll = () => {
        isClickTransition = false;
        
        const viewportCenter = window.scrollY + (window.innerHeight / 2);
        let activeSection = null;
        let minDistance = Infinity;

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

            if (progress > sectionTransitionThreshold && activeSection.nextElementSibling) {
                const nextSection = activeSection.nextElementSibling;
                const nextLink = document.querySelector(`.navigation a[href="#${nextSection.id}"]`);
                if (nextLink) {
                    moveIndicatorToLink(nextLink, -1);
                }
            } else {
                const normalizedProgress = Math.max(-1, Math.min(1, (progress * 2) - 1));
                const currentLink = document.querySelector(`.navigation a[href="#${activeSection.id}"]`);
                if (currentLink) {
                    moveIndicatorToLink(currentLink, normalizedProgress);
                }
            }
        }
    };

    // Add transition to indicator
    indicator.style.transition = 'left 0.3s ease';

    // Init indicator position
    moveIndicatorToLink(navLinks[0]);

    // Add scroll event listener with debouncing
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(onScroll, 10);
    });

    // Smooth scroll with centered indicator on click
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            isClickTransition = true;

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const targetPosition = targetSection.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                moveIndicatorToLink(link, 0);
            }
        });
    });
});
