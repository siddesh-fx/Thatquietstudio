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
let lastFocusedElement = null;

function slugify(text){

    return (text || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}

// Assign a stable slug to every project card, for deep-linking
projects.forEach(project => {
    project.dataset.slug = slugify(project.dataset.title);
    project.setAttribute("tabindex", "0");
    project.setAttribute("role", "button");
    project.setAttribute("aria-label", "View project: " + project.dataset.title);
});

function openProjectModal(project){

    if(!project) return;

    lastFocusedElement = document.activeElement;

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

    // PDF BUTTON CONTROL

    const pdfFile = project.dataset.pdf;

    if(pdfFile && pdfFile.trim() !== ""){

        pdfLink.href = pdfFile;

        pdfLink.style.display = "inline-flex";

    }else{

        pdfLink.style.display = "none";

    }

    const imageData = project.dataset.images;

    if(imageData && imageData.trim() !== ""){

        galleryImages = imageData.split(",");

        currentImage = 0;

        sliderImage.src = galleryImages[currentImage];

        document.querySelector(".slider-wrapper").style.display = "flex";

    }else{

        galleryImages = [];

        document.querySelector(".slider-wrapper").style.display = "none";

    }

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

    if(project.dataset.slug){
        history.replaceState(null, "", "#" + project.dataset.slug);
    }

    if(closeModalBtn){
        closeModalBtn.focus();
    }

}

// ====================================
// OPEN PROJECT
// ====================================

projects.forEach(project => {

project.addEventListener("click", () => {
    openProjectModal(project);
});

project.addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        openProjectModal(project);
    }
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

if(location.hash){
    history.replaceState(null, "", location.pathname + location.search);
}

if(lastFocusedElement && typeof lastFocusedElement.focus === "function"){
    lastFocusedElement.focus();
}

}


// ====================================
// CLOSE BUTTON
// ====================================

closeModalBtn.addEventListener(
"click",
closeProjectModal
);

closeModalBtn.addEventListener("keydown", (e) => {

    if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        closeProjectModal();
    }

});


// ====================================
// CLICK OUTSIDE MODAL
// ====================================

modal.addEventListener("click", (e) => {

if(e.target === modal){

closeProjectModal();

}

});


// ====================================
// ESC KEY, ARROW NAV & FOCUS TRAP
// ====================================

document.addEventListener("keydown", (e) => {

if(!modal.classList.contains("active")) return;

if(e.key === "Escape"){

closeProjectModal();
return;

}

if(e.key === "ArrowRight" && galleryImages.length > 1){
    nextBtn.click();
    return;
}

if(e.key === "ArrowLeft" && galleryImages.length > 1){
    prevBtn.click();
    return;
}

if(e.key === "Tab"){

    const focusable = modal.querySelectorAll(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
    );

    if(focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if(e.shiftKey && document.activeElement === first){
        e.preventDefault();
        last.focus();
    } else if(!e.shiftKey && document.activeElement === last){
        e.preventDefault();
        first.focus();
    }

}

});

// ====================================
// GALLERY TOUCH SWIPE
// ====================================

(function(){

    let touchStartX = 0;

    sliderImage.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    sliderImage.addEventListener("touchend", (e) => {

        const touchEndX = e.changedTouches[0].clientX;
        const delta = touchEndX - touchStartX;

        if(Math.abs(delta) < 40 || galleryImages.length <= 1) return;

        if(delta < 0){
            nextBtn.click();
        } else {
            prevBtn.click();
        }

    }, { passive: true });

})();

// ====================================
// DEEP LINK: OPEN PROJECT FROM URL HASH
// ====================================

(function(){

    function openFromHash(){

        const slug = location.hash.replace("#", "");

        if(!slug) return;

        const match = Array.from(projects).find(p => p.dataset.slug === slug);

        if(match){
            openProjectModal(match);
        }

    }

    if(document.readyState === "complete"){
        openFromHash();
    } else {
        window.addEventListener("load", openFromHash);
    }

})();


// ====================================
// INITIAL NAV STATE
// ====================================

window.dispatchEvent(
new Event("scroll")
);
// ====================================
// CONTACT FORM MAILTO
// ====================================

const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

function setFormStatus(message, isError){

    if(!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.toggle("error", !!isError);

}

contactForm.addEventListener("submit", function(e){

    e.preventDefault();

    // Honeypot check — if this hidden field got filled, silently drop it.
    const honeypot = document.getElementById("company");

    if(honeypot && honeypot.value.trim() !== ""){
        setFormStatus("Something went wrong. Please try again.", true);
        return;
    }

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const projectField = document.getElementById("project");

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const project = projectField.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!name || !email || !project){
        setFormStatus("Please fill in every field before sending.", true);
        return;
    }

    if(!emailPattern.test(email)){
        setFormStatus("That email address doesn't look right — please double-check it.", true);
        emailField.focus();
        return;
    }

    const subject =
        encodeURIComponent(`New Project Inquiry from ${name}`);

    const body =
        encodeURIComponent(
`Name: ${name}

Email: ${email}

Project Details:
${project}`
        );

    const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1&to=thatquietstudio@gmail.com&su=${subject}&body=${body}`;

    if(submitBtn){
        submitBtn.disabled = true;
    }

    window.open(gmailUrl, "_blank");

    setFormStatus("Your email client just opened — hit send there to reach us.", false);

    if(submitBtn){
        setTimeout(() => { submitBtn.disabled = false; }, 1200);
    }

});


const spotlight = document.querySelector('.spotlight');

document.addEventListener('mousemove',(e)=>{

    if(spotlight){
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
    }

});

// ====================================
// HERO HUD COORDINATE READOUT
// ====================================

const hudCoords = document.getElementById('hud-coords');
const heroSection = document.querySelector('.hero');

if(hudCoords && heroSection){

    heroSection.addEventListener('mousemove', (e) => {

        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left).toFixed(1);
        const y = (e.clientY - rect.top).toFixed(1);

        hudCoords.textContent = `X ${x}   Y ${y}`;

    });

    heroSection.addEventListener('mouseleave', () => {
        hudCoords.textContent = 'X 000.0   Y 000.0';
    });

}

// ====================================
// PRELOADER
// ====================================

(function(){

    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloaderFill');
    const pct = document.getElementById('preloaderPct');

    if(!preloader) return;

    let progress = 0;

    const tick = setInterval(() => {

        progress += Math.random() * 18;

        if(progress >= 92){
            progress = 92;
        }

        if(fill) fill.style.width = progress + '%';
        if(pct) pct.textContent = `INITIALIZING RENDER // ${Math.floor(progress)}%`;

    }, 140);

    window.addEventListener('load', () => {

        clearInterval(tick);

        if(fill) fill.style.width = '100%';
        if(pct) pct.textContent = 'INITIALIZING RENDER // 100%';

        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 350);

    });

    // Safety net in case 'load' never fires cleanly
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 6000);

})();

// ====================================
// SCROLL PROGRESS BAR
// ====================================

const scrollProgressFill = document.getElementById('scrollProgressFill');

function updateScrollProgress(){

    if(!scrollProgressFill) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    scrollProgressFill.style.width = progress + '%';

}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// ====================================
// PROJECT FILTERING
// ====================================

const filterButtons = document.querySelectorAll('.filter-btn');
const allProjects = document.querySelectorAll('.project');
const noResults = document.getElementById('noResults');

filterButtons.forEach(btn => {

    btn.addEventListener('click', () => {

        const filter = btn.dataset.filter;

        filterButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        let visibleCount = 0;

        allProjects.forEach(project => {

            const category = project.dataset.category;
            const matches = filter === 'all' || category === filter;

            project.classList.toggle('is-hidden', !matches);

            if(matches) visibleCount++;

        });

        if(noResults){
            noResults.hidden = visibleCount !== 0;
        }

    });

});

// ====================================
// FAQ ACCORDION
// ====================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {

    const answer = question.nextElementSibling;

    question.addEventListener('click', () => {

        const isOpen = question.getAttribute('aria-expanded') === 'true';

        faqQuestions.forEach(q => {

            q.setAttribute('aria-expanded', 'false');

            if(q.nextElementSibling){
                q.nextElementSibling.style.maxHeight = null;
            }

        });

        if(!isOpen){
            question.setAttribute('aria-expanded', 'true');
            if(answer){
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        }

    });

});

// ====================================
// BACK TO TOP
// ====================================

const backToTop = document.getElementById('backToTop');

if(backToTop){

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

}

// ====================================
// RETICLE CURSOR
// ====================================

(function(){

    const reticle = document.querySelector('.reticle');

    if(!reticle) return;
    if(window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    document.addEventListener('mousemove', (e) => {

        reticle.style.left = e.clientX + 'px';
        reticle.style.top = e.clientY + 'px';
        reticle.classList.add('visible');

    });

    document.addEventListener('mouseleave', () => {
        reticle.classList.remove('visible');
    });

    const hoverTargets = document.querySelectorAll('a, button, .project, .service-card, .faq-question, .pdf-card');

    hoverTargets.forEach(el => {

        el.addEventListener('mouseenter', () => reticle.classList.add('hover'));
        el.addEventListener('mouseleave', () => reticle.classList.remove('hover'));

    });

})();

// ====================================
// TOAST NOTIFICATIONS
// ====================================

function showToast(message){

    const stack = document.getElementById('toastStack');

    if(!stack) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    stack.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {

        toast.classList.remove('show');

        setTimeout(() => toast.remove(), 350);

    }, 2600);

}

// ====================================
// COPY EMAIL
// ====================================

const copyEmailBtn = document.getElementById('copyEmailBtn');

if(copyEmailBtn){

    copyEmailBtn.addEventListener('click', async () => {

        const email = copyEmailBtn.dataset.email;

        try {
            await navigator.clipboard.writeText(email);
            showToast('Email copied to clipboard');
        } catch (err) {
            showToast('Could not copy — email is ' + email);
        }

    });

}

// ====================================
// SHARE / COPY PROJECT LINK
// ====================================

const shareProjectBtn = document.getElementById('shareProjectBtn');

if(shareProjectBtn){

    shareProjectBtn.addEventListener('click', async () => {

        const url = location.href;

        if(navigator.share){

            try {
                await navigator.share({ title: document.title, url });
                return;
            } catch (err) {
                // user cancelled or share failed — fall through to clipboard copy
            }

        }

        try {
            await navigator.clipboard.writeText(url);
            showToast('Project link copied');
        } catch (err) {
            showToast('Could not copy the link');
        }

    });

}

// ====================================
// TIMELINE ESTIMATOR
// ====================================

(function(){

    const estimator = document.getElementById('estimator');

    if(!estimator) return;

    const state = { type: 'walkthrough', complexity: 'simple' };
    const resultValue = document.getElementById('estimatorValue');

    const timelines = {
        walkthrough: { simple: '2–3 weeks', standard: '3–5 weeks', complex: '6–9 weeks' },
        environment: { simple: '1–2 weeks', standard: '3–4 weeks', complex: '5–7 weeks' },
        modeling:    { simple: '3–5 days',  standard: '1–2 weeks', complex: '3–4 weeks' }
    };

    function updateResult(){

        const value = timelines[state.type][state.complexity];

        if(resultValue){
            resultValue.textContent = value;
        }

    }

    estimator.querySelectorAll('.estimator-options').forEach(group => {

        const key = group.dataset.group;

        group.querySelectorAll('.estimator-btn').forEach(btn => {

            btn.addEventListener('click', () => {

                group.querySelectorAll('.estimator-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                state[key] = btn.dataset.value;

                updateResult();

            });

        });

    });

    updateResult();

})();

// ====================================
// LIVE LOCAL TIME (HUD)
// ====================================

(function(){

    const hudClock = document.getElementById('hudClock');

    if(!hudClock) return;

    function tick(){

        const now = new Date();
        const time = now.toLocaleTimeString([], { hour12: false });

        hudClock.textContent = `LOCAL // ${time}`;

    }

    tick();
    setInterval(tick, 1000);

})();

// ====================================
// CONSOLE SIGNATURE
// ====================================

console.log(
    '%cThatQuietStudios%c // Unreal Engine 5 ArchViz Studio\nBuilt frame by frame. Curious how it works? thatquietstudio@gmail.com',
    'color:#ff6a2c;font-size:16px;font-weight:bold;',
    'color:#8b93a1;font-size:12px;'
);
