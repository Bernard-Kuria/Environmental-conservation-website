document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const dropDown = document.getElementById("drop-down");
    const faqContainers = document.querySelectorAll(".question-container");

    function initializeFaq(container) {
        const faqAnswer = container.querySelector("#answer");
        const angleDown = container.querySelector("#angle-down");
        const angleUp = container.querySelector("#angle-up");

        const hiddenIcon = container.querySelector(".icon-hidden");
        hiddenIcon.style.display = "none";

        angleDown.addEventListener("click", () => {
            faqAnswer.classList.remove('hidden');
            angleDown.style.display = "none";
            angleUp.style.display = "block";
        });

        angleUp.addEventListener("click", () => {
            faqAnswer.classList.add('hidden');
            angleDown.style.display = "block";
            angleUp.style.display = "none";
        });
    }

    // Initialize each FAQ item
    faqContainers.forEach(initializeFaq);

    // Menu icon event listener
    menuIcon.addEventListener("click", () => {
        dropDown.classList.toggle('hidden');
    });

    function updateMenuIconVisibility() {
        if (window.innerWidth < 750) {
            menuIcon.style.display = 'block';
        } else {
            dropDown.classList.add('hidden');
            menuIcon.style.display = 'none';
        }
    }

    // Initial check
    updateMenuIconVisibility();

    // Listen for resize events
    window.addEventListener('resize', updateMenuIconVisibility);
});