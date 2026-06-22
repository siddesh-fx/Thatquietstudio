// ====================================
// REVEAL ANIMATION
// ====================================

const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(

(entries) => {

entries.forEach(entry => {

if(entry.isIntersecting){
entry.target.classList.add("active");
}

});

},

{
threshold:0.15
}

);

reveals.forEach(section => {
revealObserver.observe(section);
});


// ====================================
// ACTIVE NAVIGATION
// ====================================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".bottom-nav a");

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {

const sectionTop = section.offsetTop - 250;

if(window.scrollY >= sectionTop){

current = section.getAttribute("id");

}

});

navLinks.forEach(link => {

link.classList.remove("active");

if(link.getAttribute("href") === "#" + current){

link.classList.add("active");

}

});

});


// ====================================
// STATS COUNTER
// ====================================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(

(entries) => {

entries.forEach(entry => {

if(entry.isIntersecting){

const counter = entry.target;

const target = Number(counter.dataset.target);

let current = 0;

const increment = target / 80;

const updateCounter = () => {

current += increment;

if(current < target){

counter.innerText = Math.ceil(current);

requestAnimationFrame(updateCounter);

}else{

counter.innerText = target;

}

};

updateCounter();

counterObserver.unobserve(counter);

}

});

},

{
threshold:0.5
}

);

counters.forEach(counter => {
counterObserver.observe(counter);
});


// ====================================
// PROJECT MODAL
// ====================================

const projects =
document.querySelectorAll(".project");

const modal =
document.querySelector(".project-modal");

const modalTitle =
document.getElementById("modalTitle");

const modalDesc =
document.getElementById("modalDesc");

const modalVideo =
document.getElementById("modalVideo");

const modalSoftware =
document.getElementById("modalSoftware");

const modalFeatures =
document.getElementById("modalFeatures");

const pdfLink =
document.getElementById("pdfLink");

const sliderImage =
document.getElementById("sliderImage");

const closeModalBtn =
document.querySelector(".close-modal");

const nextBtn =
document.getElementById("nextBtn");

const prevBtn =
document.getElementById("prevBtn");

let galleryImages = [];
let currentImage = 0;


// ====================================
// OPEN PROJECT
// ====================================

projects.forEach(project => {

project.addEventListener("click", () => {

modalTitle.textContent =
project.dataset.title;

modalDesc.textContent =
project.dataset.desc;

const videoSrc = project.dataset.video;

if(videoSrc && videoSrc.trim() !== "") {

    modalVideo.src = videoSrc;
    modalVideo.style.display = "block";

} else {

    modalVideo.style.display = "none";
}

modalSoftware.textContent =
project.dataset.software;

modalFeatures.textContent =
project.dataset.features;

pdfLink.href =
project.dataset.pdf;

galleryImages =
project.dataset.images.split(",");

currentImage = 0;

sliderImage.src =
galleryImages[currentImage];

modal.classList.add("active");

document.body.style.overflow = "hidden";

});

});


// ====================================
// NEXT IMAGE
// ====================================

nextBtn.addEventListener("click", () => {

currentImage++;

if(currentImage >= galleryImages.length){

currentImage = 0;

}

sliderImage.src =
galleryImages[currentImage];

});


// ====================================
// PREVIOUS IMAGE
// ====================================

prevBtn.addEventListener("click", () => {

currentImage--;

if(currentImage < 0){

currentImage =
galleryImages.length - 1;

}

sliderImage.src =
galleryImages[currentImage];

});


// ====================================
// CLOSE MODAL FUNCTION
// ====================================

function closeProjectModal(){

modal.classList.remove("active");

modalVideo.pause();

modalVideo.currentTime = 0;

document.body.style.overflow = "auto";

}


// ====================================
// CLOSE BUTTON
// ====================================

closeModalBtn.addEventListener(
"click",
closeProjectModal
);


// ====================================
// CLICK OUTSIDE MODAL
// ====================================

modal.addEventListener("click", (e) => {

if(e.target === modal){

closeProjectModal();

}

});


// ====================================
// ESC KEY CLOSE
// ====================================

document.addEventListener("keydown", (e) => {

if(e.key === "Escape"){

closeProjectModal();

}

});


// ====================================
// INITIAL NAV STATE
// ====================================

window.dispatchEvent(
new Event("scroll")
);
