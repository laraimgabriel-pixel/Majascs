/* =========================================
   JANGG BIRTHDAY WEBSITE
   PUBLIC CONTENT SYSTEM
========================================= */

const SECRET_DATE = "021425";


/* =========================================
   COUNTDOWN SETTINGS
========================================= */

const TEST_MODE = true;
const TEST_COUNTDOWN_SECONDS = 05;


/*
   October 29, 2026
   12:00 AM Philippine Time
*/

const REAL_BIRTHDAY_TARGET =
    Date.UTC(2026, 9, 28, 16, 0, 0);

const BIRTHDAY_TARGET = TEST_MODE
    ? Date.now() + (TEST_COUNTDOWN_SECONDS * 1000)
    : REAL_BIRTHDAY_TARGET;


/* =========================================
   ELEMENTS
========================================= */

const countdownScreen =
    document.getElementById("countdown-screen");

const countdownDays =
    document.getElementById("countdown-days");

const countdownHours =
    document.getElementById("countdown-hours");

const countdownMinutes =
    document.getElementById("countdown-minutes");

const countdownSeconds =
    document.getElementById("countdown-seconds");


const lockScreen =
    document.getElementById("lock-screen");

const birthdaySite =
    document.getElementById("birthday-site");

const dateInput =
    document.getElementById("secret-date");

const unlockButton =
    document.getElementById("unlock-button");

const errorMessage =
    document.getElementById("error-message");

const openSurprise =
    document.getElementById("open-surprise");

const birthdayContent =
    document.getElementById("birthday-content");


/* =========================================
   COUNTDOWN
========================================= */

let countdownTimer = null;


function showPasswordScreen() {

    if (!countdownScreen) {
        return;
    }

    countdownScreen.classList.add(
        "countdown-finished"
    );

    setTimeout(() => {

        countdownScreen.style.display =
            "none";

        if (lockScreen) {
            lockScreen.style.display =
                "flex";
        }

    }, 900);
}


function updateBirthdayCountdown() {

    if (!countdownScreen) {
        return;
    }

    const remaining =
        BIRTHDAY_TARGET - Date.now();


    if (remaining <= 0) {

        if (countdownTimer) {
            clearInterval(countdownTimer);
        }

        countdownTimer = null;


        if (countdownDays) {
            countdownDays.textContent = "00";
        }

        if (countdownHours) {
            countdownHours.textContent = "00";
        }

        if (countdownMinutes) {
            countdownMinutes.textContent = "00";
        }

        if (countdownSeconds) {
            countdownSeconds.textContent = "00";
        }


        showPasswordScreen();

        return;
    }


    const totalSeconds =
        Math.floor(
            remaining / 1000
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );


    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    if (countdownDays) {
        countdownDays.textContent =
            String(days).padStart(2, "0");
    }


    if (countdownHours) {
        countdownHours.textContent =
            String(hours).padStart(2, "0");
    }


    if (countdownMinutes) {
        countdownMinutes.textContent =
            String(minutes).padStart(2, "0");
    }


    if (countdownSeconds) {
        countdownSeconds.textContent =
            String(seconds).padStart(2, "0");
    }
}


function startBirthdayCountdown() {

    if (!countdownScreen) {
        return;
    }


    if (Date.now() < BIRTHDAY_TARGET) {

        countdownScreen.style.display =
            "flex";


        if (lockScreen) {
            lockScreen.style.display =
                "none";
        }


        updateBirthdayCountdown();


        countdownTimer =
            setInterval(
                updateBirthdayCountdown,
                250
            );

    } else {

        countdownScreen.style.display =
            "none";


        if (lockScreen) {
            lockScreen.style.display =
                "flex";
        }
    }
}


startBirthdayCountdown();


/* =========================================
   UNLOCK WEBSITE
========================================= */

function unlockWebsite() {

    if (!dateInput || !lockScreen) {
        return;
    }


    const enteredDate =
        dateInput.value
            .replace(/\D/g, "")
            .slice(0, 6);


    if (enteredDate === SECRET_DATE) {

        if (errorMessage) {
            errorMessage.textContent = "";
        }


        lockScreen.classList.add(
            "unlocking"
        );


        setTimeout(() => {

            lockScreen.style.display =
                "none";


            if (birthdaySite) {

                birthdaySite.classList.remove(
                    "hidden"
                );

            }


            sessionStorage.setItem(
                "janggUnlocked",
                "true"
            );

        }, 1000);


    } else {

        const card =
            document.querySelector(
                ".lock-card"
            );


        if (card) {

            card.classList.remove(
                "shake"
            );


            void card.offsetWidth;


            card.classList.add(
                "shake"
            );
        }


        if (errorMessage) {

            errorMessage.textContent =
                "Hmm... that's not the special date. Try again ♡";

        }


        dateInput.value = "";
        dateInput.focus();
    }
}


/* =========================================
   UNLOCK BUTTON
========================================= */

if (unlockButton) {

    unlockButton.addEventListener(
        "click",
        unlockWebsite
    );

}


/* =========================================
   ENTER KEY
========================================= */

if (dateInput) {

    dateInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                unlockWebsite();

            }

        }
    );

}


/* =========================================
   REMEMBER UNLOCK
========================================= */

if (!TEST_MODE) {

    if (
        sessionStorage.getItem(
            "janggUnlocked"
        ) === "true"
    ) {

        if (lockScreen) {

            lockScreen.style.display =
                "none";

        }


        if (birthdaySite) {

            birthdaySite.classList.remove(
                "hidden"
            );

        }

    }

} else {

    sessionStorage.removeItem(
        "janggUnlocked"
    );

}


/* =========================================
   OPEN SURPRISE
========================================= */

if (
    openSurprise &&
    birthdayContent
) {

    openSurprise.addEventListener(
        "click",
        function() {

            birthdayContent.classList.remove(
                "hidden"
            );


            birthdayContent.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


/* =========================================
   GET DEFAULT CONTENT
========================================= */

function getDefaultContent() {

    if (
        typeof SITE_CONTENT ===
        "undefined"
    ) {

        console.error(
            "SITE_CONTENT is missing."
        );


        return {};

    }


    return JSON.parse(
        JSON.stringify(
            SITE_CONTENT
        )
    );

}


/* =========================================
   LOAD PUBLISHED CONTENT
========================================= */

async function getPublishedContent() {

    const fallback =
        getDefaultContent();


    if (
        typeof supabaseClient !==
        "undefined"
    ) {

        try {

            const {
                data,
                error
            } = await supabaseClient

                .from(
                    "birthday_content"
                )

                .select(
                    "content"
                )

                .eq(
                    "id",
                    1
                )

                .eq(
                    "published",
                    true
                )

                .single();


            if (
                !error &&
                data &&
                data.content
            ) {

                console.log(
                    "✓ Loaded published birthday content from Supabase."
                );


                return mergeContent(
                    fallback,
                    data.content
                );

            }


            if (error) {

                console.log(
                    "No published Supabase content yet. Using default content."
                );

            }

        } catch (error) {

            console.error(
                "Supabase content error:",
                error
            );

        }

    }


    try {

        const saved =
            localStorage.getItem(
                "janggBirthdayContent"
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            return mergeContent(
                fallback,
                parsed
            );

        }

    } catch (error) {

        console.error(
            "Local content error:",
            error
        );

    }


    return fallback;

}


/* =========================================
   MERGE CONTENT
========================================= */

function mergeContent(
    defaults,
    saved
) {

    const result = {
        ...defaults,
        ...saved
    };


    result.welcome = {

        ...(defaults.welcome || {}),
        ...(saved.welcome || {})

    };


    if (
        Array.isArray(
            defaults.photos
        )
    ) {

        result.photos =
            defaults.photos.map(
                (
                    defaultPhoto,
                    index
                ) => {

                    const savedPhoto =
                        Array.isArray(
                            saved.photos
                        )
                            ? saved.photos[index]
                            : null;


                    return {

                        ...defaultPhoto,

                        ...(savedPhoto || {})

                    };

                }
            );

    }


    if (
        Array.isArray(
            defaults.memories
        )
    ) {

        result.memories =
            defaults.memories.map(
                (
                    defaultMemory,
                    index
                ) => {

                    const savedMemory =
                        Array.isArray(
                            saved.memories
                        )
                            ? saved.memories[index]
                            : null;


                    return {

                        ...defaultMemory,

                        ...(savedMemory || {})

                    };

                }
            );

    }


    result.letter = {

        ...(defaults.letter || {}),
        ...(saved.letter || {})

    };


    if (
        saved.letterMessage
    ) {

        result.letter.message =
            saved.letterMessage;

    }


    if (
        saved.letterSignature
    ) {

        result.letter.signature =
            saved.letterSignature;

    }


    return result;

}


/* =========================================
   LOAD EVERYTHING
========================================= */

async function loadSiteContent() {

    const content =
        await getPublishedContent();


    console.log(
        "Birthday content:",
        content
    );

    window.__JANGG_PUBLIC_CONTENT = content;

window.dispatchEvent(
    new CustomEvent("janggPublicContentLoaded")
);

    /*
       Make loaded content available to
       embedded public features such as
       Open When and other dynamic sections.
    */

    window.__JANGG_PUBLIC_CONTENT =
        content;

    window.dispatchEvent(
        new CustomEvent(
            "janggPublicContentLoaded"
        )
    );


    /* WELCOME */

    const welcomeSmall =
        document.querySelector(
            ".welcome-small"
        );


    const welcomeMessage =
        document.querySelector(
            ".welcome-message"
        );


    const welcomeSubmessage =
        document.querySelector(
            ".welcome-submessage"
        );


    const welcomeFooter =
        document.querySelector(
            ".scroll-hint"
        );


    const welcomeName =
        document.querySelector(
            ".welcome h1 span"
        );


    if (welcomeSmall) {

        welcomeSmall.textContent =
            content.welcomeSmall ||
            "";

    }


    if (welcomeMessage) {

        welcomeMessage.textContent =
            content.welcomeMessage ||
            "";

    }


    if (welcomeSubmessage) {

        welcomeSubmessage.textContent =
            content.welcomeSubmessage ||
            "";

    }


    if (welcomeFooter) {

        welcomeFooter.textContent =
            content.welcomeFooter ||
            "";

    }


    if (welcomeName) {

        welcomeName.textContent =
            (
                content.personName ||
                "Jangg"
            ) + " ♡";

    }


    /* SCRAPBOOK HEADER */

    const scrapbookLabel =
        document.querySelector(
            ".section-label"
        );


    const scrapbookTitle =
        document.querySelector(
            ".memories-section h2"
        );


    const scrapbookIntro =
        document.querySelector(
            ".section-intro"
        );


    if (scrapbookLabel) {

        scrapbookLabel.textContent =
            content.scrapbookKicker ||
            "";

    }


    if (scrapbookTitle) {

        scrapbookTitle.textContent =
            content.scrapbookTitle ||
            "";

    }


    if (scrapbookIntro) {

        scrapbookIntro.textContent =
            content.scrapbookSubtitle ||
            "";

    }


    /* HEART SCRAPBOOK */

    const heartPhotos =
        document.querySelectorAll(
            ".heart-photo"
        );


    heartPhotos.forEach(
        (
            card,
            index
        ) => {

            const photo =
                content.photos &&
                content.photos[index];


            if (!photo) {
                return;
            }


            if (
                typeof photo.rotation ===
                "number"
            ) {

                card.style.transform =
                    `rotate(${photo.rotation}deg)`;

            }


            const caption =
                card.querySelector(
                    ".photo-caption"
                );


            if (caption) {

                caption.textContent =
                    photo.caption ||
                    "";

            }


            const placeholder =
                card.querySelector(
                    ".photo-placeholder"
                );


            const imageSource =
                photo.src ||
                photo.image ||
                "";


            if (
                placeholder &&
                imageSource.trim() !== ""
            ) {

                placeholder.innerHTML =
                    "";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    imageSource;


                image.alt =
                    photo.caption ||
                    "Birthday memory";


                image.loading =
                    "lazy";


                placeholder.appendChild(
                    image
                );

            }

        }
    );


    /* =====================================
       STAGE 3
       MAKE SCRAPBOOK PHOTOS INTERACTIVE
    ===================================== */

    setupInteractiveScrapbookPhotos();


    /* THREE LITTLE MEMORIES */

    const memoryNotes =
        document.querySelectorAll(
            ".memory-note"
        );


    memoryNotes.forEach(
        (
            note,
            index
        ) => {

            const memory =
                content.memories &&
                content.memories[index];


            if (!memory) {
                return;
            }


            const title =
                note.querySelector(
                    "h3"
                );


            if (title) {

                title.textContent =
                    memory.title ||
                    "";

            }


            const date =
                note.querySelector(
                    ".memory-date"
                );


            if (date) {

                date.textContent =
                    memory.date ||
                    "";

            }


            const story =
                note.querySelector(
                    ".memory-story"
                );


            if (story) {

                story.textContent =
                    memory.caption ||
                    memory.story ||
                    "";

            }


            const memoryPhoto =
                note.querySelector(
                    ".memory-mini-photo"
                );


            const imageSource =
                memory.image ||
                "";


            if (
                memoryPhoto &&
                imageSource.trim() !== ""
            ) {

                memoryPhoto.innerHTML =
                    "";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    imageSource;


                image.alt =
                    memory.title ||
                    "Memory photo";


                image.loading =
                    "lazy";


                memoryPhoto.appendChild(
                    image
                );

            }

        }
    );


    /* APPRECIATION */

    renderAppreciation(
        content.appreciation
    );


    /* BIRTHDAY LETTER */

    renderAppreciation(content.appreciation);

    renderLetter(

        content.letter &&
        content.letter.message,

        content.letter &&
        content.letter.signature,

        content.personName ||
        "Jangg"

    );

}


/* =========================================
   RENDER APPRECIATION
========================================= */

function renderAppreciation(
    appreciation
) {

    if (!appreciation) {
        return;
    }


    const kicker =
        document.querySelector(
            ".appreciation-kicker"
        );


    const title =
        document.querySelector(
            ".appreciation-header h2"
        );


    const intro =
        document.querySelector(
            ".appreciation-intro"
        );


    const ending =
        document.querySelector(
            ".appreciation-ending"
        );


    if (kicker) {

        kicker.textContent =
            appreciation.kicker ||
            "";

    }


    if (title) {

        title.textContent =
            String(
                appreciation.title ||
                ""
            );

    }


    if (intro) {

        intro.textContent =
            appreciation.intro ||
            "";

    }


    if (ending) {

        ending.textContent =
            appreciation.ending ||
            "";

    }


    const cards =
        Array.isArray(
            appreciation.cards
        )
            ? appreciation.cards
            : [];


    const elements =
        document.querySelectorAll(
            ".appreciation-card"
        );


    elements.forEach(
        function(card, index) {

            const data =
                cards[index];


            if (!data) {
                return;
            }


            const front =
                card.querySelector(
                    ".appreciation-front p"
                );


            const back =
                card.querySelector(
                    ".appreciation-back p"
                );


            if (front) {

                front.textContent =
                    data.front ||
                    "";

            }


            if (back) {

                back.textContent =
                    data.back ||
                    "";

            }

        }
    );

}

/* =========================================
   RENDER APPRECIATION
========================================= */

function renderAppreciation(appreciation) {

    const section =
        document.querySelector(
            ".appreciation-section"
        );

    if (!section) {
        return;
    }

    if (
        !appreciation ||
        typeof appreciation !== "object"
    ) {
        return;
    }

    const kicker =
        section.querySelector(
            ".appreciation-kicker"
        );

    const title =
        section.querySelector(
            ".appreciation-header h2"
        );

    const intro =
        section.querySelector(
            ".appreciation-intro"
        );

    const ending =
        section.querySelector(
            ".appreciation-ending"
        );


    if (kicker) {
        kicker.textContent =
            appreciation.kicker || "";
    }


    if (title) {
        title.textContent =
            appreciation.title || "";
    }


    if (intro) {
        intro.textContent =
            appreciation.intro || "";
    }


    if (ending) {
        ending.textContent =
            appreciation.ending || "";
    }


    const cards =
        Array.isArray(
            appreciation.cards
        )
            ? appreciation.cards
            : [];


    const cardElements =
        section.querySelectorAll(
            ".appreciation-card"
        );


    cardElements.forEach(
        function(card, index) {

            const data =
                cards[index];

            if (!data) {
                return;
            }


            const front =
                card.querySelector(
                    ".appreciation-front p"
                );


            const back =
                card.querySelector(
                    ".appreciation-back p"
                );


            if (front) {
                front.textContent =
                    data.front || "";
            }


            if (back) {
                back.textContent =
                    data.back || "";
            }

        }
    );


    console.log(
        "✓ Appreciation updated:",
        cards.length,
        "cards"
    );

}

/* =========================================
   RENDER LETTER
========================================= */

function renderLetter(
    message,
    signature,
    name
) {

    const messageBox =
        document.querySelector(
            ".letter-message"
        );


    const signatureBox =
        document.querySelector(
            ".letter-signature strong"
        );


    const greeting =
        document.querySelector(
            ".letter-greeting"
        );


    if (greeting) {

        greeting.textContent =
            `Dear ${name},`;

    }


    if (messageBox) {

        messageBox.innerHTML =
            "";


        const paragraphs =
            String(
                message || ""
            ).split(
                /\n\s*\n/
            );


        paragraphs.forEach(
            text => {

                const p =
                    document.createElement(
                        "p"
                    );


                p.textContent =
                    text;


                if (
                    text.trim()
                ) {

                    messageBox.appendChild(
                        p
                    );

                }

            }
        );

    }


    if (signatureBox) {

        signatureBox.textContent =
            signature || "";

    }

}


/* =========================================
   START
========================================= */

loadSiteContent();


/* =========================================
   REFRESH DATABASE CONTENT
========================================= */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key ===
            "janggBirthdayContent"
        ) {

            loadSiteContent();

        }

    }
);


/* =========================================================
   BIRTHDAY GIFT — ENHANCED REVEAL
========================================================= */

const birthdayGift =
    document.getElementById(
        "birthday-gift"
    );


const birthdayReveal =
    document.getElementById(
        "birthday-reveal"
    );


let giftAlreadyOpened = false;


if (
    birthdayGift &&
    birthdayReveal
) {

    birthdayGift.addEventListener(
        "click",
        function() {

            if (giftAlreadyOpened) {
                return;
            }


            giftAlreadyOpened = true;


            birthdayGift.classList.add(
                "opened"
            );


            createSparkleBurst(
                birthdayGift
            );


            setTimeout(() => {

                createBirthdayCelebration();


                birthdayReveal.classList.remove(
                    "hidden"
                );


                birthdayReveal.classList.add(
                    "birthday-reveal-active"
                );


                birthdayReveal.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


            }, 650);

        }
    );

}


/* =========================================================
   BIG BIRTHDAY CELEBRATION
========================================================= */

function createBirthdayCelebration() {

    const glow =
        document.createElement(
            "div"
        );


    glow.className =
        "birthday-screen-glow";


    document.body.appendChild(
        glow
    );


    setTimeout(() => {

        glow.remove();

    }, 2200);


    createBirthdayConfetti(
        65
    );


    createHeartBurst(
        32
    );


    createSparkleRain(
        35
    );


    setTimeout(() => {

        createBirthdayConfetti(
            30
        );


        createHeartBurst(
            18
        );


    }, 900);

}


/* =========================================================
   CONFETTI
========================================================= */

function createBirthdayConfetti(
    amount = 40
) {

    const symbols = [
        "♡",
        "♥",
        "✦",
        "✧",
        "⋆",
        "❀"
    ];


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const piece =
            document.createElement(
                "span"
            );


        piece.className =
            "birthday-confetti";


        piece.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        piece.style.left =
            Math.random() * 100 +
            "vw";


        piece.style.animationDelay =
            Math.random() * 1.2 +
            "s";


        piece.style.fontSize =
            (
                11 +
                Math.random() * 18
            ) + "px";


        piece.style.setProperty(
            "--fall-x",
            (
                Math.random() * 180 -
                90
            ) + "px"
        );


        piece.style.setProperty(
            "--rotation",
            (
                Math.random() * 720 -
                360
            ) + "deg"
        );


        document.body.appendChild(
            piece
        );


        setTimeout(() => {

            piece.remove();

        }, 4500);

    }

}


/* =========================================================
   HEART BURST
========================================================= */

function createHeartBurst(
    amount = 25
) {

    const symbols = [
        "♡",
        "♥",
        "♡",
        "✦"
    ];


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.className =
            "birthday-heart-burst";


        heart.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        heart.style.left =
            (
                50 +
                Math.random() * 20 -
                10
            ) + "vw";


        heart.style.top =
            (
                50 +
                Math.random() * 16 -
                8
            ) + "vh";


        heart.style.setProperty(
            "--burst-x",
            (
                Math.random() * 500 -
                250
            ) + "px"
        );


        heart.style.setProperty(
            "--burst-y",
            (
                Math.random() * 500 -
                250
            ) + "px"
        );


        heart.style.setProperty(
            "--heart-size",
            (
                12 +
                Math.random() * 20
            ) + "px"
        );


        document.body.appendChild(
            heart
        );


        setTimeout(() => {

            heart.remove();

        }, 1800);

    }

}


/* =========================================================
   SPARKLE BURST
========================================================= */

function createSparkleBurst(
    element
) {

    const rect =
        element.getBoundingClientRect();


    const symbols = [
        "✦",
        "✧",
        "⋆",
        "♡"
    ];


    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.className =
            "birthday-sparkle-burst";


        sparkle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        sparkle.style.left =
            (
                rect.left +
                rect.width / 2
            ) + "px";


        sparkle.style.top =
            (
                rect.top +
                rect.height / 2
            ) + "px";


        sparkle.style.setProperty(
            "--sparkle-x",
            (
                Math.random() * 220 -
                110
            ) + "px"
        );


        sparkle.style.setProperty(
            "--sparkle-y",
            (
                Math.random() * 220 -
                110
            ) + "px"
        );


        document.body.appendChild(
            sparkle
        );


        setTimeout(() => {

            sparkle.remove();

        }, 1400);

    }

}


/* =========================================================
   SPARKLE RAIN
========================================================= */

function createSparkleRain(
    amount = 30
) {

    const symbols = [
        "✦",
        "✧",
        "⋆"
    ];


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.className =
            "birthday-sparkle-rain";


        sparkle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        sparkle.style.left =
            Math.random() * 100 +
            "vw";


        sparkle.style.top =
            Math.random() * 35 +
            "vh";


        sparkle.style.animationDelay =
            Math.random() * 1.5 +
            "s";


        document.body.appendChild(
            sparkle
        );


        setTimeout(() => {

            sparkle.remove();

        }, 3500);

    }

}


/* =========================================================
   APPRECIATION CARDS — LITTLE DISCOVERY GAME
========================================================= */

const appreciationCards =
    document.querySelectorAll(
        ".appreciation-card"
    );


if (appreciationCards.length > 0) {

    const appreciationSection =
        document.querySelector(
            ".appreciation-section"
        );


    const appreciationGrid =
        document.querySelector(
            ".appreciation-cards"
        );


    if (
        appreciationSection &&
        appreciationGrid
    ) {

        const gameHeader =
            document.createElement(
                "div"
            );


        gameHeader.className =
            "appreciation-game-header";


        gameHeader.innerHTML = `
            <p class="appreciation-game-kicker">
                a little something for you ♡
            </p>

            <h3 class="appreciation-game-title">
                5 little things I appreciate about you
            </h3>

            <p class="appreciation-game-subtitle">
                There are five hidden messages waiting for you...
            </p>

            <div class="appreciation-progress">
                <span class="appreciation-progress-heart">♡</span>

                <span id="appreciation-count">
                    0 / ${appreciationCards.length} discovered
                </span>

                <span class="appreciation-progress-heart">♡</span>
            </div>
        `;


        appreciationSection.insertBefore(
            gameHeader,
            appreciationGrid
        );


        const completionMessage =
            document.createElement(
                "div"
            );


        completionMessage.className =
            "appreciation-complete";


        completionMessage.innerHTML = `
            <div class="appreciation-complete-symbol">
                ✦
            </div>

            <h3>
                You found them all ♡
            </h3>

            <p>
                And honestly, there are still so many more.
            </p>
        `;


        appreciationGrid.after(
            completionMessage
        );

    }


    appreciationCards.forEach(
        (
            card,
            index
        ) => {

            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "appreciation-card-number";


            number.textContent =
                String(index + 1).padStart(
                    2,
                    "0"
                );


            card.appendChild(
                number
            );

        }
    );


    const discoveredCards =
        new Set();


    let appreciationFinished =
        false;


    appreciationCards.forEach(
        (
            card,
            index
        ) => {

            card.addEventListener(
                "click",
                () => {

                    card.classList.toggle(
                        "revealed"
                    );


                    if (
                        card.classList.contains(
                            "revealed"
                        )
                    ) {

                        discoveredCards.add(
                            index
                        );


                        card.classList.add(
                            "discovered"
                        );


                        createAppreciationSparkles(
                            card
                        );

                    }


                    const count =
                        document.getElementById(
                            "appreciation-count"
                        );


                    if (count) {

                        count.textContent =
                            `${discoveredCards.size} / ${appreciationCards.length} discovered`;

                    }


                    if (
                        discoveredCards.size ===
                        appreciationCards.length &&
                        !appreciationFinished
                    ) {

                        appreciationFinished =
                            true;


                        setTimeout(
                            () => {

                                showAppreciationComplete();

                            },
                            450
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   APPRECIATION SPARKLES
========================================================= */

function createAppreciationSparkles(
    card
) {

    const rect =
        card.getBoundingClientRect();


    const symbols = [
        "♡",
        "✦",
        "✧"
    ];


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.className =
            "appreciation-sparkle";


        sparkle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        sparkle.style.left =
            (
                rect.left +
                rect.width / 2
            ) + "px";


        sparkle.style.top =
            (
                rect.top +
                rect.height / 2
            ) + "px";


        sparkle.style.setProperty(
            "--spark-x",
            (
                Math.random() * 120 -
                60
            ) + "px"
        );


        sparkle.style.setProperty(
            "--spark-y",
            (
                Math.random() * 120 -
                60
            ) + "px"
        );


        document.body.appendChild(
            sparkle
        );


        setTimeout(
            () => {

                sparkle.remove();

            },
            1100
        );

    }

}


/* =========================================================
   APPRECIATION COMPLETION
========================================================= */

function showAppreciationComplete() {

    const completion =
        document.querySelector(
            ".appreciation-complete"
        );


    if (!completion) {
        return;
    }


    completion.classList.add(
        "show"
    );


    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.className =
            "appreciation-celebration-heart";


        heart.textContent =
            Math.random() > .35
                ? "♡"
                : "✦";


        heart.style.left =
            Math.random() * 100 +
            "vw";


        heart.style.setProperty(
            "--celebrate-x",
            (
                Math.random() * 140 -
                70
            ) + "px"
        );


        heart.style.animationDelay =
            Math.random() * .6 +
            "s";


        document.body.appendChild(
            heart
        );


        setTimeout(
            () => {

                heart.remove();

            },
            2800
        );

    }

}


/* =========================================================
   STAGE 3 — INTERACTIVE SCRAPBOOK
========================================================= */

let scrapbookModal = null;


/*
   Create the photo viewer only once.
*/

function createScrapbookModal() {

    if (scrapbookModal) {
        return scrapbookModal;
    }


    scrapbookModal =
        document.createElement(
            "div"
        );


    scrapbookModal.className =
        "scrapbook-modal";


    scrapbookModal.innerHTML = `
        <div class="scrapbook-modal-backdrop"></div>

        <div
            class="scrapbook-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="Birthday memory"
        >

            <button
                type="button"
                class="scrapbook-modal-close"
                aria-label="Close photo"
            >
                ×
            </button>

            <div class="scrapbook-modal-photo-wrap">

                <img
                    class="scrapbook-modal-image"
                    src=""
                    alt=""
                >

            </div>

            <div class="scrapbook-modal-caption">
                <span class="scrapbook-modal-heart">♡</span>

                <p></p>

                <span class="scrapbook-modal-heart">♡</span>
            </div>

            <p class="scrapbook-modal-hint">
                tap outside to close ♡
            </p>

        </div>
    `;


    document.body.appendChild(
        scrapbookModal
    );


    const backdrop =
        scrapbookModal.querySelector(
            ".scrapbook-modal-backdrop"
        );


    const closeButton =
        scrapbookModal.querySelector(
            ".scrapbook-modal-close"
        );


    backdrop.addEventListener(
        "click",
        closeScrapbookModal
    );


    closeButton.addEventListener(
        "click",
        closeScrapbookModal
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                scrapbookModal &&
                scrapbookModal.classList.contains(
                    "show"
                )
            ) {

                closeScrapbookModal();

            }

        }
    );


    return scrapbookModal;

}


/*
   Open the selected scrapbook photo.
*/

function openScrapbookPhoto(
    card
) {

    const modal =
        createScrapbookModal();


    const image =
        card.querySelector(
            ".photo-placeholder img"
        );


    const caption =
        card.querySelector(
            ".photo-caption"
        );


    const modalImage =
        modal.querySelector(
            ".scrapbook-modal-image"
        );


    const modalCaption =
        modal.querySelector(
            ".scrapbook-modal-caption p"
        );


    if (!image) {

        /*
           Don't open an empty placeholder.
        */

        return;

    }


    modalImage.src =
        image.src;


    modalImage.alt =
        image.alt ||
        "Birthday memory";


    modalCaption.textContent =
        caption
            ? caption.textContent
            : "";


    modal.classList.add(
        "show"
    );


    document.body.classList.add(
        "scrapbook-modal-open"
    );


    /*
       Little sparkle effect around
       the clicked photo.
    */

    createScrapbookPhotoSparkles(
        card
    );

}


/*
   Close photo viewer.
*/

function closeScrapbookModal() {

    if (!scrapbookModal) {
        return;
    }


    scrapbookModal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "scrapbook-modal-open"
    );

}


/*
   Add sparkle burst to clicked photo.
*/

function createScrapbookPhotoSparkles(
    card
) {

    const rect =
        card.getBoundingClientRect();


    const symbols = [
        "♡",
        "✦",
        "✧",
        "⋆"
    ];


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.className =
            "scrapbook-photo-sparkle";


        sparkle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        sparkle.style.left =
            (
                rect.left +
                rect.width / 2
            ) + "px";


        sparkle.style.top =
            (
                rect.top +
                rect.height / 2
            ) + "px";


        sparkle.style.setProperty(
            "--photo-spark-x",
            (
                Math.random() * 150 -
                75
            ) + "px"
        );


        sparkle.style.setProperty(
            "--photo-spark-y",
            (
                Math.random() * 150 -
                75
            ) + "px"
        );


        document.body.appendChild(
            sparkle
        );


        setTimeout(
            () => {

                sparkle.remove();

            },
            1200
        );

    }

}


/*
   Attach click behavior to all eight
   existing heart scrapbook photos.

   IMPORTANT:
   This does NOT change their
   position, rotation, or layout.
*/

function setupInteractiveScrapbookPhotos() {

    const photos =
        document.querySelectorAll(
            ".heart-photo"
        );


    if (!photos.length) {
        return;
    }


    photos.forEach(
        (
            card
        ) => {

            /*
               Prevent duplicate listeners
               if Supabase content reloads.
            */

            if (
                card.dataset.scrapbookInteractive ===
                "true"
            ) {

                return;

            }


            card.dataset.scrapbookInteractive =
                "true";


            card.classList.add(
                "scrapbook-photo-interactive"
            );


            card.addEventListener(
                "click",
                function(event) {

                    /*
                       Ignore clicks directly on
                       links/buttons if one is
                       ever added inside the photo.
                    */

                    if (
                        event.target.closest(
                            "button, a"
                        )
                    ) {

                        return;

                    }


                    openScrapbookPhoto(
                        card
                    );

                }
            );

        }
    );

}


/* =========================================================
   REDUCED MOTION
========================================================= */

if (
    window.matchMedia &&
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
) {

    document.documentElement.classList.add(
        "reduce-motion"
    );

}


/* =========================================================
   STAGE 4 — INTERACTIVE BIRTHDAY LETTER
========================================================= */

function setupInteractiveBirthdayLetter() {

    const letterSection =
        document.querySelector(
            ".birthday-letter-section"
        );


    const letter =
        document.querySelector(
            ".birthday-letter"
        );


    const letterTop =
        document.querySelector(
            ".birthday-letter .letter-top"
        );


    const letterMessage =
        document.querySelector(
            ".birthday-letter .letter-message"
        );


    const letterSignature =
        document.querySelector(
            ".birthday-letter .letter-signature"
        );


    if (
        !letterSection ||
        !letter ||
        !letterTop ||
        !letterMessage ||
        !letterSignature
    ) {

        return;

    }


    /* Prevent duplicate setup */

    if (
        letterSection.dataset.interactiveLetter === "true"
    ) {

        return;

    }


    letterSection.dataset.interactiveLetter =
        "true";


    /* Start closed */

    letterSection.classList.add(
        "letter-closed"
    );


    /* Create button */

    const openButton =
        document.createElement(
            "button"
        );


    openButton.type =
        "button";


    openButton.className =
        "letter-open-button";


    openButton.innerHTML =
        `Open My Letter <span class="open-heart">♡</span>`;


    /* Put button between letter-top and letter-content */

    letterTop.insertAdjacentElement(
        "afterend",
        openButton
    );


    /* Open letter */

    openButton.addEventListener(
        "click",
        function() {

            letterSection.classList.remove(
                "letter-closed"
            );


            letterSection.classList.add(
                "letter-opened"
            );


            openButton.classList.add(
                "opened"
            );


            createLetterCelebration();

        }
    );

}


/* =========================================================
   LETTER HEART CELEBRATION
========================================================= */

function createLetterCelebration() {

    const symbols = [
        "♡",
        "✦",
        "✧",
        "♥"
    ];


    for (let i = 0; i < 16; i++) {

        const heart =
            document.createElement(
                "span"
            );


        heart.className =
            "letter-celebration-heart";


        heart.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        const x =
            window.innerWidth * 0.25 +
            Math.random() *
            (window.innerWidth * 0.5);


        const y =
            window.innerHeight * 0.45 +
            Math.random() *
            100;


        heart.style.left =
            x + "px";


        heart.style.top =
            y + "px";


        heart.style.setProperty(
            "--heart-x",
            (Math.random() * 180 - 90) + "px"
        );


        heart.style.setProperty(
            "--heart-y",
            (Math.random() * -180 - 40) + "px"
        );


        heart.style.animationDelay =
            (Math.random() * 0.45) + "s";


        heart.style.fontSize =
            (12 + Math.random() * 14) + "px";


        document.body.appendChild(
            heart
        );


        setTimeout(() => {

            heart.remove();

        }, 2200);

    }

}


/* =========================================================
   START LETTER INTERACTION
========================================================= */

setupInteractiveBirthdayLetter();


/* =========================================================
   STAGE 6 — LOVE MUSIC PLAYER
========================================================= */

(function setuploveMusic() {

    if (
        document.querySelector(".birthday-music-player")
    ) {

        return;

    }


    /* -----------------------------------------
       MUSIC SETTINGS
    ----------------------------------------- */

    const musicSettings =
        typeof SITE_CONTENT !== "undefined" &&
        SITE_CONTENT.music
            ? SITE_CONTENT.music
            : {};


    /*
       Use love as the fallback.
       This means the player still works even
       if the content settings are empty.
    */

    const musicUrl =
        musicSettings.audioUrl ||
        "assets/love.mp3";


    const musicTitle =
        musicSettings.title ||
        "love ♡";


    /* -----------------------------------------
       AUDIO
    ----------------------------------------- */

    const audio =
        document.createElement("audio");


    audio.id =
        "love-audio";


    audio.src =
        musicUrl;


    audio.loop =
        true;


    audio.preload =
        "auto";


    audio.style.display =
        "none";


    document.body.appendChild(
        audio
    );


    /* -----------------------------------------
       PLAYER
    ----------------------------------------- */

    const player =
        document.createElement("div");


    player.className =
        "birthday-music-player";


    /* PLAY BUTTON */

    const playButton =
        document.createElement("button");


    playButton.type =
        "button";


    playButton.className =
        "music-play-button";


    playButton.textContent =
        "▶";


    playButton.setAttribute(
        "aria-label",
        "Play love"
    );


    /* INFO */

    const info =
        document.createElement("div");


    info.className =
        "music-player-info";


    const title =
        document.createElement("p");


    title.className =
        "music-player-title";


    title.textContent =
        musicTitle;


    const status =
        document.createElement("p");


    status.className =
        "music-player-status";


    status.textContent =
        "your little song ♡";


    /* PROGRESS */

    const progress =
        document.createElement("input");


    progress.type =
        "range";


    progress.className =
        "music-progress";


    progress.min =
        "0";


    progress.max =
        "100";


    progress.value =
        "0";


    progress.step =
        "0.1";


    progress.setAttribute(
        "aria-label",
        "Song progress"
    );


    /* BUILD */

    info.appendChild(title);

    info.appendChild(status);

    info.appendChild(progress);

    player.appendChild(playButton);

    player.appendChild(info);

    document.body.appendChild(player);


    /* -----------------------------------------
       SHOW PLAYER
    ----------------------------------------- */

    const birthdaySite =
        document.getElementById(
            "birthday-site"
        );


    function showPlayer() {

        if (!birthdaySite) {
            return;
        }


        if (
            !birthdaySite.classList.contains(
                "hidden"
            )
        ) {

            player.classList.add(
                "visible"
            );

        }

    }


    showPlayer();


    /* Watch unlock screen */

    if (birthdaySite) {

        const observer =
            new MutationObserver(
                function() {

                    showPlayer();

                }
            );


        observer.observe(
            birthdaySite,
            {
                attributes: true,
                attributeFilter: [
                    "class"
                ]
            }
        );

    }


    /* -----------------------------------------
       PLAY
    ----------------------------------------- */

    async function playMusic() {

        try {

            await audio.play();


            player.classList.add(
                "playing"
            );


            playButton.textContent =
                "Ⅱ";


            playButton.setAttribute(
                "aria-label",
                "Pause love"
            );


            status.textContent =
                "playing ♫";


        } catch (error) {

            console.log(
                "love needs a user tap."
            );


            status.textContent =
                "tap ▶ to play";

        }

    }


    /* -----------------------------------------
       PAUSE
    ----------------------------------------- */

    function pauseMusic() {

        audio.pause();


        player.classList.remove(
            "playing"
        );


        playButton.textContent =
            "▶";


        playButton.setAttribute(
            "aria-label",
            "Play love"
        );


        status.textContent =
            "paused";

    }


    /* -----------------------------------------
       PLAY BUTTON
    ----------------------------------------- */

    playButton.addEventListener(
        "click",
        function() {

            if (audio.paused) {

                playMusic();

            } else {

                pauseMusic();

            }

        }
    );


    /* -----------------------------------------
       START AFTER OPEN SURPRISE
    ----------------------------------------- */

    const openSurprise =
        document.getElementById(
            "open-surprise"
        );


    if (openSurprise) {

        openSurprise.addEventListener(
            "click",
            function() {

                setTimeout(
                    function() {

                        playMusic();

                    },
                    200
                );

            }
        );

    }


    /* -----------------------------------------
       PROGRESS
    ----------------------------------------- */

    audio.addEventListener(
        "timeupdate",
        function() {

            if (
                !audio.duration ||
                !isFinite(audio.duration)
            ) {

                return;

            }


            progress.value =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;

        }
    );


    /* -----------------------------------------
       SEEK
    ----------------------------------------- */

    progress.addEventListener(
        "input",
        function() {

            if (
                !audio.duration ||
                !isFinite(audio.duration)
            ) {

                return;

            }


            audio.currentTime =
                audio.duration *
                (
                    Number(progress.value) /
                    100
                );

        }
    );


    /* -----------------------------------------
       ERROR
    ----------------------------------------- */

    audio.addEventListener(
        "error",
        function() {

            status.textContent =
                "couldn't load love";


            console.error(
                "Music file could not be loaded:",
                musicUrl
            );

        }
    );

})();