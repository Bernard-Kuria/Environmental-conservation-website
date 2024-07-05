const miniSignUp = document.getElementById('mini-signin');
const cancelSignup = document.getElementById('cancel_signup');
const signIn = document.getElementById('signin');
const signUp = document.getElementById('acc');
const navDisplay = document.getElementById('nav-display');
const navCancel = document.getElementById('nav-cancel');
const miniMenu = document.getElementById('display-menu');
const myHello = document.getElementById('hello');
const signinBtn = document.getElementById('signin-btn');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const aboutUs = document.getElementById('about-us');
const activitySection = document.getElementById('activity-section');
const contact = document.getElementById('contact');
const loginCancel = document.getElementById('login-cancel');

const slider = document.querySelector('.slider');
const containers = document.querySelectorAll('.slide-container');
const chevronLeft = document.querySelector('.fa-chevron-left');
const chevronRight = document.querySelector('.fa-chevron-right');
const dotsContainer = document.createElement('div');
const testimonials = document.querySelectorAll('.feedback-content');
const leftArrow = document.querySelector('#testimonials .fa-chevron-left');
const rightArrow = document.querySelector('#testimonials .fa-chevron-right');
const partners = document.querySelector('#partners');
const partnerCards = document.querySelector('.partner-cards');
const partnerScrollRight = document.querySelector('.fa-circle-chevron-right');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
document.querySelector('.slider-wrapper').appendChild(dotsContainer);


const actionImages = document.querySelectorAll('.slide');
let currentImg = 0;
function changeSlide(n) {
    actionImages.forEach((img) => img.classList.remove('active'));    
    actionImages[currentImg].classList.add('active');actionImages[currentImg].style.transition = 'opacity 0.5s';
    currentImg++;
    currentImg = currentImg >= actionImages.length ? 0 : currentImg;
}
const timer = setInterval(changeSlide, 4000);

/* activities sliding operation */
dotsContainer.classList.add('dots');
let index = 0;
let isTransitioning = false;

function createDots() {
    containers.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (idx === 0) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            if (!isTransitioning) {
                goToSlide(idx);
                updateDots(idx);
            }
        });
        dotsContainer.appendChild(dot);
    });
}

function updateDots(activeIndex) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function showSlide(i) {
    containers.forEach((container, idx) => {
        container.style.transition = 'none';
        container.style.opacity = '0';
        container.style.display = 'none';
    });
    containers[i].style.display = 'block';
    containers[i].style.opacity = '1';
    containers[i].style.transition = 'opacity 0.5s, transform 0.5s';
    containers[i].style.transform = 'translateX(0)';
    updateDots(i);
}

function goToSlide(i, direction) {
    if (isTransitioning || i === index) return;
    isTransitioning = true;
    const currentIndex = index;
    const nextIndex = i;

    containers[currentIndex].style.transition = 'opacity 0.5s, transform 0.5s';
    containers[currentIndex].style.opacity = '0';
    containers[currentIndex].style.transform = direction === 'left' ? 'translateX(-50%)' : 'translateX(50%)';
    setTimeout(() => {
        containers[currentIndex].style.display = 'none';
        index = nextIndex;
        containers[nextIndex].style.display = 'block';
        containers[nextIndex].style.opacity = '0';
        containers[nextIndex].style.transform = direction === 'left' ? 'translateX(50%)' : 'translateX(-50%)';
        setTimeout(() => {
            containers[nextIndex].style.transition = 'opacity 0.5s, transform 0.5s';
            containers[nextIndex].style.opacity = '1';
            containers[nextIndex].style.transform = 'translateX(0)';
            isTransitioning = false;
            updateDots(index);
        }, 300);
    }, 300);
}

function navigateSlide(step) {
    if (isTransitioning) return;
    const nextIndex = (index + step + containers.length) % containers.length;
    const direction = step > 0 ? 'left' : 'right';
    goToSlide(nextIndex, direction);
}

prev.addEventListener('click', () => {
    navigateSlide(-1);
});

next.addEventListener('click', () => {
    navigateSlide(1);
});

chevronLeft.addEventListener('click', () => {
    prev.click();
});

chevronRight.addEventListener('click', () => {
    next.click();
});

createDots();
showSlide(index);

        /* Testimonials Slider */
let testimonialIndex = 0;
let isTestimonialTransitioning = false;

function showTestimonial(index) {
    testimonials.forEach((testimonial, idx) => {
        testimonial.style.transition = 'none';
        testimonial.style.opacity = '0';
        testimonial.style.display = 'none';
    });
    testimonials[index].style.display = 'block';
    testimonials[index].style.opacity = '1';
    testimonials[index].style.transition = 'opacity 0.5s, transform 0.5s';
}

function goToTestimonial(i, direction) {
    if (isTestimonialTransitioning || i === testimonialIndex) return;
    isTestimonialTransitioning = true;
    const currentIndex = testimonialIndex;
    const nextIndex = i;

    testimonials[currentIndex].style.transition = 'opacity 0.5s, transform 0.5s';
    testimonials[currentIndex].style.opacity = '0';
    setTimeout(() => {
        testimonials[currentIndex].style.display = 'none';
        testimonialIndex = nextIndex;
        testimonials[nextIndex].style.display = 'block';
        testimonials[nextIndex].style.opacity = '0';
        setTimeout(() => {
            testimonials[nextIndex].style.transition = 'opacity 0.5s, transform 0.5s';
            testimonials[nextIndex].style.opacity = '1';
            isTestimonialTransitioning = false;
        }, 200);
    }, 200);
}

function navigateTestimonial(step) {
    if (isTestimonialTransitioning) return;
    const nextIndex = (testimonialIndex + step + testimonials.length) % testimonials.length;
    const direction = step > 0 ? 'left' : 'right';
    goToTestimonial(nextIndex, direction);
}

leftArrow.addEventListener('click', () => {
    navigateTestimonial(-1);
});

rightArrow.addEventListener('click', () => {
    navigateTestimonial(1);
});

showTestimonial(testimonialIndex);

        /* mini-menu buttons execution */
navDisplay.addEventListener("click", (event) => {
    navDisplay.classList.add('nav-display-hidden');
    navCancel.classList.remove('nav-display-hidden');
    miniMenu.classList.remove('nav-display-hidden');
});

navCancel.addEventListener("click", (event) => {
    navDisplay.classList.remove('nav-display-hidden');
    navCancel.classList.add('nav-display-hidden');
    miniMenu.classList.add('nav-display-hidden');
});

loginCancel.addEventListener("click", (event) => {    
    signIn.classList.add('hidden');
});

cancelSignup.addEventListener("click", (event) => {
    signUp.classList.add('hidden');
});

miniSignUp.addEventListener("click", (event) => {
    signUp.classList.remove('hidden');
    miniMenu.classList.toggle('nav-display-hidden');
    navDisplay.classList.toggle('nav-display-hidden');
    navCancel.classList.toggle('nav-display-hidden');
});

signinBtn.addEventListener("click", (event) => {
    signUp.classList.toggle('hidden');
    signIn.classList.add('hidden');
})

document.addEventListener('click', (event) => {
    if (!miniMenu.contains(event.target) && !navDisplay.contains(event.target)) {
        miniMenu.classList.add('nav-display-hidden');
        navDisplay.classList.remove('nav-display-hidden');
        navCancel.classList.add('nav-display-hidden');
    }
});

/* window resizing functionalities */
function updateMenuIconVisibility() {
    if (window.innerWidth < 750) {
        miniMenu.classList.add('nav-display-hidden');
        navDisplay.classList.remove('nav-display-hidden');
        navCancel.classList.add('nav-display-hidden');
    }
}

window.addEventListener('resize', updateMenuIconVisibility);

document.querySelector('.main-menu').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('menu')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
    } else if (e.target.classList.contains('menu-signin')) {
        signIn.classList.remove('hidden');
    }
})

/* Creating functionality for tabbed components */

tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;
    tabs.forEach(t => t.classList.remove('operation__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    clicked.classList.add('operation__tab--active');

    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


partnerScrollRight.addEventListener('click', function (e) {
    const pcoords = partnerCards.getBoundingClientRect();
    console.log(pcoords);
})
// partnerCards.scrollTo(20, 0);