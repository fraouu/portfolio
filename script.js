const slotPhotoUrldog = "https://i.ibb.co/HL9PgXxC/image-no-bg-preview-carve-photos.png";
const symbols = [
    { type: "image", src: slotPhotoUrldog, alt: "Фото" },
    { type: "emoji", value: "🦴" },
    { type: "emoji", value: "🎲" },
    { type: "emoji", value: "💎" },
    { type: "emoji", value: "🍒" },
    { type: "emoji", value: "🐾" },
    { type: "emoji", value: "⭐" }
];
const pugSymbol = { type: "image", src: slotPhotoUrldog, alt: "Джекпот" };
const pugImgUrl = "https://i.ibb.co/HL9PgXxC/image-no-bg-preview-carve-photos.png";

const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");
const spinBtn = document.getElementById("spinButton");
const turboToggle = document.getElementById("turboToggle");
const activeSectionLabel = document.getElementById("activeSectionLabel");
const sectionLinks = document.querySelectorAll(".nav-links a[data-section-title]");
const trackedSections = document.querySelectorAll("#about, #achievements, #slot, #contacts");
const certificateSlider = document.getElementById("certificateSlider");
const slidePhotoLink = document.getElementById("slidePhotoLink");
const slideImage = document.getElementById("slideImage");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");

const certificateSlides = [
    {
        title: "В«РҐР°РєР°С‚РѕРЅВ»",
        image: "https://placehold.co/1200x720/0b0b0d/ffd35a?text=Hackathon",
        link: "https://placehold.co/1200x720/0b0b0d/ffd35a?text=Hackathon"
    },
    {
        title: "Р РµРіРёРѕРЅР°Р»СЊРЅС‹Р№ С‡РµРјРїРёРѕРЅР°С‚ В«РџСЂРѕС„РµСЃСЃРёРѕРЅР°Р»С‹В»",
        image: "https://placehold.co/1200x720/0b0b0d/ffd35a?text=Professionals",
        link: "https://placehold.co/1200x720/0b0b0d/ffd35a?text=Professionals"
    },
    {
        title: "Р¤РµСЃС‚РёРІР°Р»СЊ РєСЂРµР°С‚РёРІР°",
        image: "https://placehold.co/1200x720/0b0b0d/ffd35a?text=Creative+Fest",
        link: "https://placehold.co/1200x720/0b0b0d/ffd35a?text=Creative+Fest"
    },
    {
        title: "В«РњРѕР»РѕРґРѕР№ РІРµР±-РґРёР·Р°Р№РЅВ»",
        image: "https://placehold.co/1200x720/0b0b0d/ffd35a?text=Young+Web+Design",
        link: "https://placehold.co/1200x720/0b0b0d/ffd35a?text=Young+Web+Design"
    }
];

let totalSpins = 0;
let isSpinning = false;
let endlessRainTimer = null;
let currentCertificateSlide = 0;
let certificateSlideTimer = null;

function renderReelSymbol(reelElement, symbol) {
    reelElement.replaceChildren();

    if (symbol.type === "image") {
        const image = document.createElement("img");
        image.className = "reel-photo";
        image.src = symbol.src;
        image.alt = symbol.alt;
        reelElement.appendChild(image);
        return;
    }

    reelElement.textContent = symbol.value;
}

function animateReel(reelElement, finalSymbol) {
    return new Promise((resolve) => {
        let steps = 0;
        const isTurbo = turboToggle.checked;
        const maxSteps = isTurbo ? 7 : 14;
        const frameDelay = isTurbo ? 34 : 58;
        reelElement.classList.add("spinning");

        const interval = setInterval(() => {
            renderReelSymbol(reelElement, symbols[Math.floor(Math.random() * symbols.length)]);
            reelElement.style.transform = `translateY(${steps % 2 ? -4 : 4}px) scale(${steps % 2 ? 1.02 : 0.98})`;
            steps++;

            if (steps >= maxSteps) {
                clearInterval(interval);
                renderReelSymbol(reelElement, finalSymbol);
                reelElement.style.transform = "";
                reelElement.classList.remove("spinning");
                resolve();
            }
        }, frameDelay);
    });
}

function createPugRain(count = 95, lifespan = 3600) {
    for (let i = 0; i < count; i++) {
        const drop = document.createElement("div");
        const size = Math.floor(Math.random() * 64 + 64);

        drop.className = "pug-rain-element";
        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        drop.style.left = `${Math.random() * window.innerWidth}px`;
        drop.style.animationDuration = `${Math.random() * 1.8 + 1.3}s`;
        drop.style.animationDelay = `${Math.random() * 0.45}s`;
        drop.style.backgroundImage = `url("${pugImgUrl}")`;

        document.body.appendChild(drop);
        setTimeout(() => drop.remove(), lifespan);
    }
}


function stopEndlessPugRain() {
    if (!endlessRainTimer) return;
    clearInterval(endlessRainTimer);
    endlessRainTimer = null;
    document.removeEventListener("pointerdown", stopEndlessPugRain);
}

function startEndlessPugRain() {
    stopEndlessPugRain();
    createPugRain(95, 3600);
    endlessRainTimer = setInterval(() => createPugRain(28, 3600), 520);

    setTimeout(() => {
        document.addEventListener("pointerdown", stopEndlessPugRain);
    }, 250);
}

function showJackpotMessage() {
    const message = document.createElement("div");
    message.className = "jackpot-message";
    message.innerHTML = "<strong>Р”Р¶РµРєРїРѕС‚!</strong> РўСЂРё РјРѕРїСЃР° РІС‹РїР°Р»Рё РѕРґРЅРѕРІСЂРµРјРµРЅРЅРѕ";
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 1900);
}

async function regularSpin() {
    const finalSymbols = Array.from(
        { length: 3 },
        () => symbols[Math.floor(Math.random() * symbols.length)]
    );

    await animateReel(reel1, finalSymbols[0]);
    await animateReel(reel2, finalSymbols[1]);
    await animateReel(reel3, finalSymbols[2]);
}

async function jackpotSpin() {
    await animateReel(reel1, pugSymbol);
    await animateReel(reel2, pugSymbol);
    await animateReel(reel3, pugSymbol);
    startEndlessPugRain();
    showJackpotMessage();
}

async function spinAction() {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;

    if (totalSpins === 9) {
        await jackpotSpin();
        totalSpins = 0;
    } else {
        await regularSpin();
        totalSpins++;
    }

    spinBtn.disabled = false;
    isSpinning = false;
}

spinBtn.addEventListener("click", spinAction);
renderReelSymbol(reel1, pugSymbol);

function showCertificateSlide(index) {
    const nextIndex = (index + certificateSlides.length) % certificateSlides.length;
    const slide = certificateSlides[nextIndex];

    currentCertificateSlide = nextIndex;
    certificateSlider.classList.remove("is-glitch");
    void certificateSlider.offsetWidth;
    certificateSlider.classList.add("is-glitch");

    slideImage.src = slide.image;
    slideImage.alt = slide.title;
    slidePhotoLink.href = slide.link;

    window.setTimeout(() => {
        certificateSlider.classList.remove("is-glitch");
    }, 440);
}

function restartCertificateAutoplay() {
    clearInterval(certificateSlideTimer);
    certificateSlideTimer = setInterval(() => {
        showCertificateSlide(currentCertificateSlide + 1);
    }, 5200);
}

if (certificateSlider) {
    prevSlideBtn.addEventListener("click", () => {
        showCertificateSlide(currentCertificateSlide - 1);
        restartCertificateAutoplay();
    });

    nextSlideBtn.addEventListener("click", () => {
        showCertificateSlide(currentCertificateSlide + 1);
        restartCertificateAutoplay();
    });

    restartCertificateAutoplay();
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));

        if (!target) return;
        event.preventDefault();
        if (link.dataset.sectionTitle) {
            setActiveSection(target.id);
        }

        const navHeight = document.querySelector(".nav")?.offsetHeight || 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 18;

        smoothScrollTo(Math.max(targetTop, 0));
    });
});

function smoothScrollTo(targetY) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 850;
    let startTime = null;

    function easeInOutCubic(progress) {
        return progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    }

    function animateScroll(currentTime) {
        if (startTime === null) {
            startTime = currentTime;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }

    requestAnimationFrame(animateScroll);
}

function setActiveSection(sectionId) {
    const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
    if (!activeLink) return;

    activeSectionLabel.textContent = activeLink.dataset.sectionTitle;
    sectionLinks.forEach((link) => {
        link.classList.toggle("is-active", link === activeLink);
    });
}

function updateActiveSectionByScroll() {
    const viewportLine = window.innerHeight * 0.38;
    let activeSection = trackedSections[0];

    trackedSections.forEach((section) => {
        if (section.getBoundingClientRect().top <= viewportLine) {
            activeSection = section;
        }
    });

    setActiveSection(activeSection.id);
}

window.addEventListener("scroll", updateActiveSectionByScroll, { passive: true });
window.addEventListener("resize", updateActiveSectionByScroll);
updateActiveSectionByScroll();
