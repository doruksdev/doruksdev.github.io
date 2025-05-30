/*==================== SHOW MENU ====================*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)
    
    // Validate that variables exist
    if(toggle && nav){
        // Function to handle menu toggle
        const toggleMenu = () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            // Toggle ARIA expanded state
            toggle.setAttribute('aria-expanded', !isExpanded);
            // Toggle menu visibility
            nav.classList.toggle('show-menu');
        };

        // Click event listener
        toggle.addEventListener('click', toggleMenu);
        
        // Keyboard event listener for accessibility
        toggle.addEventListener('keydown', (e) => {
            // Trigger on Enter or Space key
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== SHOW SCROLL TOP ====================*/ 
function scrollTop(){
    let scrollTop = document.getElementById('scroll-top');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 200) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

// Update ARIA attributes based on theme
const updateThemeAccessibility = () => {
    const isDarkTheme = document.body.classList.contains(darkTheme);
    themeButton.setAttribute('aria-checked', isDarkTheme.toString());
    themeButton.setAttribute('title', isDarkTheme ? 'Açık temaya geç' : 'Karanlık temaya geç');
    themeButton.setAttribute('aria-label', isDarkTheme ? 'Açık temaya geç' : 'Karanlık temaya geç');
};

// Initialize theme accessibility attributes
updateThemeAccessibility();

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    // Update accessibility attributes
    updateThemeAccessibility();
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});

// Add keyboard support for theme toggle
themeButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeButton.click();
    }
});


/*==================== REDUCE THE SIZE AND PRINT ON AN A4 SHEET ====================*/ 
function scaleCv(){
    document.body.classList.add('scale-cv')
}

/*==================== REMOVE THE SIZE WHEN THE CV IS DOWNLOADED ====================*/ 
function removeScale(){
    document.body.classList.remove('scale-cv')
}


/*==================== GENERATE PDF ====================*/ 
// PDF generated area
let areaCv = document.getElementById('area-cv');

let resumeButton = document.getElementById('resume-button');

// Html2pdf options
let opt = {
    margin:       0,
    filename:     'SerhatDoruk.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 4 },
    jsPDF:        { format: 'a4', orientation: 'portrait' }
}

function generateResume(){
    let pdfOptions = { ...opt }; // Copy the original options
    
    try {
        // Create a timestamp for the filename
        const now = new Date();
        const timestamp = now.getFullYear() + '-' +
                        String(now.getMonth() + 1).padStart(2, '0') + '-' +
                        String(now.getDate()).padStart(2, '0') + '_' +
                        String(now.getHours()).padStart(2, '0') + '-' +
                        String(now.getMinutes()).padStart(2, '0') + '-' +
                        String(now.getSeconds()).padStart(2, '0');
        
        // Update options with timestamp filename
        pdfOptions.filename = `SerhatDoruk_CV_${timestamp}.pdf`;
    } catch (error) {
        // If there's an error, use the default filename defined in opt
        console.log('Error creating timestamp for filename, using default:', error);
        // pdfOptions already has the default filename from opt
    }
    
    // Generate PDF with the configured filename
    html2pdf(areaCv, pdfOptions);
}

// When the button is clicked, it executes the three functions
resumeButton.addEventListener('click', () =>{
    // 1. The class .scale-cv is added to the body, where it reduces the size of the elements
    scaleCv()

    // 2. The PDF is generated
    generateResume()

    // 3. The .scale-cv class is removed from the body after 5 seconds to return to normal size.
    setTimeout(removeScale, 5000)
})

// Add keyboard support for PDF generation
resumeButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        resumeButton.click();
    }
});

// Add accessibility initialization on page load
document.addEventListener('DOMContentLoaded', () => {
    // Ensure all navigation links have appropriate focus indicators
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('focus', () => {
            link.setAttribute('aria-current', 'false');
        });
    });
    
    // Make sure active-link has appropriate ARIA attribute
    const updateActiveLink = () => {
        navLinks.forEach(link => {
            const isActive = link.classList.contains('active-link');
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    };
    
    // Call on page load and during scrolling
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink);
    
    // Make sure scroll-top is keyboard accessible
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
        scrollTop.setAttribute('role', 'button');
        scrollTop.setAttribute('aria-label', 'Sayfa başına dön');
        scrollTop.setAttribute('tabindex', '0');
        
        scrollTop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        });
    }
});
