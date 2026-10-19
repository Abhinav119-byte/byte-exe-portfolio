"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. HELPER FUNCTIONS
    // =========================================

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];


    // =========================================
    // 2. TOAST NOTIFICATIONS
    // =========================================

    const toast = $("#toast");
    let toastTimer;

    function showToast(message) {

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }


    // =========================================
    // 3. MOBILE NAVIGATION
    // =========================================

    const menuToggle = $("#menu-toggle");
    const navLinks = $("#nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.textContent = isOpen ? "×" : "☰";

        });

        $$("#nav-links a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.textContent = "☰";

            });

        });
    }


    // =========================================
    // 4. BYTE PERSONALITY SYSTEM
    // =========================================

    const robot = $("#byte-robot");
    const robotSpeech = $("#robot-speech");
    const robotScene = $("#robot-scene");

    const robotMessages = [
        "BEEP BOOP! HUMAN DETECTED.",
        "DO YOU HAVE ANY COOL IDEAS?",
        "MY BATTERY RUNS ON CURIOSITY.",
        "I LEFT MY SCREWDRIVER IN 404.",
        "CAN WE BUILD SOMETHING IMPOSSIBLE?",
        "PLEASE DO NOT FEED ME BUGS.",
        "YOU LOOK LIKE A CREATIVE HUMAN.",
        "MY NEXT INVENTION NEEDS MORE PIXELS."
    ];

    const moodMessages = {

        happy:
            "HAPPINESS.EXE LOADED! I LIKE YOU, HUMAN. ♥",

        sleepy:
            "LOW POWER MODE... FIVE MORE MINUTES, PLEASE.",

        curious:
            "WAIT... WHAT DOES THIS BUTTON DO? SHOULD I PRESS IT?",

        glitch:
            "WARNING! REALITY.EXE IS GETTING WEIRD!"

    };

    const robotMoods = [
        "happy",
        "sleepy",
        "curious",
        "glitch"
    ];

    let activeRobotMood = "normal";
    let messageIndex = 0;
    let moodResetTimer;


    function changeRobotMessage(message) {

        if (robotSpeech) {
            robotSpeech.textContent = message;
        }

    }


    function setRobotMood(mood, options = {}) {

        if (!robot) return;

        const validMoods = ["normal", ...robotMoods];

        if (!validMoods.includes(mood)) return;

        clearTimeout(moodResetTimer);

        robot.classList.remove(
            "mood-happy",
            "mood-sleepy",
            "mood-curious",
            "mood-glitch"
        );

        activeRobotMood = mood;

        if (mood !== "normal") {
            robot.classList.add(`mood-${mood}`);
        }

        if (
            options.speak !== false &&
            moodMessages[mood]
        ) {
            changeRobotMessage(moodMessages[mood]);
        }

        if (mood === "glitch") {
            showToast("BYTE.EXE HAS ENTERED GLITCH MODE!");
        }

        if (
            mood !== "normal" &&
            options.persistent !== true
        ) {

            moodResetTimer = setTimeout(() => {

                robot.classList.remove(
                    "mood-happy",
                    "mood-sleepy",
                    "mood-curious",
                    "mood-glitch"
                );

                activeRobotMood = "normal";

            }, mood === "sleepy" ? 6500 : 4200);

        }
    }


    // Make the robot interactive.

    if (robot) {

        robot.setAttribute("role", "button");
        robot.setAttribute("tabindex", "0");

        robot.setAttribute(
            "aria-label",
            "Byte the robot. Activate to change his mood."
        );

        robot.style.cursor = "pointer";


        function reactToRobotClick() {

            const nextMoodIndex =
                activeRobotMood === "normal"
                    ? 0
                    : (
                        robotMoods.indexOf(activeRobotMood) + 1
                    ) % robotMoods.length;

            const nextMood = robotMoods[nextMoodIndex];

            setRobotMood(nextMood);

            showToast(
                `BYTE MOOD: ${nextMood.toUpperCase()}`
            );

        }


        robot.addEventListener(
            "click",
            reactToRobotClick
        );


        robot.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                reactToRobotClick();

            }

        });


        robot.addEventListener("mouseenter", () => {

            if (robotScene) {
                robotScene.classList.add(
                    "robot-scene-active"
                );
            }

        });


        robot.addEventListener("mouseleave", () => {

            if (robotScene) {
                robotScene.classList.remove(
                    "robot-scene-active"
                );
            }

        });

    }


    // =========================================
    // 5. READ MORE STORY
    // =========================================

    const readMoreButton = $("#read-more");
    const extraStory = $("#extra-story");

    if (readMoreButton && extraStory) {

        readMoreButton.addEventListener("click", () => {

            const isHidden = extraStory.hidden;

            extraStory.hidden = !isHidden;

            readMoreButton.textContent = isHidden
                ? "[ HIDE EXTRA STORY − ]"
                : "[ READ MY FULL STORY + ]";

        });

    }


    // =========================================
    // 6. INTERACTIVE LAB
    // =========================================

    const labRobot = $("#lab-robot");
    const labOutput = $("#lab-output");

    const labButtons = $$(".lab-button");

    const labMoods = {

        happy: {
            className: "mood-happy",

            message:
                "BYTE: WOW! I THINK I JUST DISCOVERED HAPPINESS. IS THIS A FEATURE OR A BUG?",

            speech:
                "HAPPINESS.EXE LOADED!"
        },

        sleepy: {
            className: "mood-sleepy",

            message:
                "BYTE: ENTERING LOW POWER MODE... ZZZ... PLEASE WAKE ME WHEN THE WIFI RETURNS.",

            speech:
                "ZZZ... LOW POWER..."
        },

        glitch: {
            className: "mood-glitch",

            message:
                "BYTE: WARNING! SYSTEM GLITCH DETECTED. I THINK I JUST SAW TOMORROW.",

            speech:
                "SYSTEM GLITCHING!"
        }

    };


    labButtons.forEach(button => {

        button.addEventListener("click", () => {

            const mood = button.dataset.mood;

            const selectedMood = labMoods[mood];

            if (!selectedMood) return;


            // Change the main robot's expression.

            setRobotMood(mood);


            // Change the laboratory robot.

            if (labRobot) {

                labRobot.classList.remove(
                    "mood-happy",
                    "mood-sleepy",
                    "mood-glitch"
                );

                labRobot.classList.add(
                    selectedMood.className
                );

            }


            // Highlight the selected button.

            labButtons.forEach(item => {

                item.classList.toggle(
                    "active",
                    item === button
                );

            });


            // Display the experiment result.

            if (labOutput) {

                labOutput.textContent =
                    selectedMood.message;

            }


            changeRobotMessage(selectedMood.speech);


            if (mood === "glitch") {

                showToast(
                    "WARNING: REALITY.EXE IS ACTING WEIRD."
                );

            }

        });

    });


    // =========================================
    // 7. MODAL MANAGEMENT
    // =========================================

    const terminalModal = $("#terminal-modal");
    const projectModal = $("#project-modal");

    let lastFocusedElement = null;


    function openModal(modal) {

        if (!modal) return;

        lastFocusedElement = document.activeElement;

        modal.hidden = false;

        document.body.classList.add("modal-open");

        const input = $("input", modal);

        if (input) {
            input.focus();
        } else {

            const closeButton = $(
                "[data-close-modal]",
                modal
            );

            if (closeButton) {
                closeButton.focus();
            }

        }

    }


    function closeModal(modal) {

        if (!modal) return;

        modal.hidden = true;

        const anotherModalOpen = [
            terminalModal,
            projectModal
        ].some(item => item && !item.hidden);

        document.body.classList.toggle(
            "modal-open",
            anotherModalOpen
        );

        if (
            !anotherModalOpen &&
            lastFocusedElement?.isConnected
        ) {

            lastFocusedElement.focus();

        }

    }


    // Open terminal.

    const openTerminalButton = $("#open-terminal");

    if (openTerminalButton) {

        openTerminalButton.addEventListener("click", () => {

            openModal(terminalModal);

        });

    }


    // Close buttons.

    $$("[data-close-modal]").forEach(button => {

        button.addEventListener("click", () => {

            closeModal(
                button.closest(".modal-overlay")
            );

        });

    });


    // Close by clicking outside the modal.

    [terminalModal, projectModal].forEach(modal => {

        if (!modal) return;

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                closeModal(modal);
            }

        });

    });


    // Close using Escape.

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        [terminalModal, projectModal].forEach(modal => {

            if (modal && !modal.hidden) {
                closeModal(modal);
            }

        });

    });


    // =========================================
    // 8. SECRET TERMINAL
    // =========================================

    const terminalForm = $("#terminal-form");
    const terminalInput = $("#terminal-input");
    const terminalHistory = $("#terminal-history");

    const terminalCommands = {

        help: () => ({

            message:
                "AVAILABLE COMMANDS:\n" +
                "HELP      - Show commands\n" +
                "ABOUT     - Learn about Byte\n" +
                "STATUS    - Check system status\n" +
                "JOKE      - Hear a robot joke\n" +
                "INVENTORY - View Byte's tools\n" +
                "SECRET    - Discover a hidden message\n" +
                "CLEAR     - Clear terminal history"

        }),

        about: () => ({

            message:
                "I'M BYTE-001, A TINY ROBOT INVENTOR.\n" +
                "MY MISSION: BRING A FORGOTTEN DIGITAL UNIVERSE BACK TO LIFE."

        }),

        status: () => ({

            message:
                "SYSTEM: ONLINE\n" +
                "BATTERY: 87%\n" +
                "CURIOSITY: 100%\n" +
                "MEMORY: QUESTIONABLE\n" +
                "HUMAN FRIENDLINESS: MAXIMUM"

        }),

        joke: () => ({

            message:
                "WHY DID THE ROBOT GO ON VACATION?\n" +
                "IT NEEDED TO RECHARGE ITS SOCIAL BATTERIES."

        }),

        inventory: () => ({

            message:
                "INVENTORY:\n" +
                "- 1 PIXEL SCREWDRIVER\n" +
                "- 3 QUESTIONABLE IDEAS\n" +
                "- 1 HALF-FINISHED TIME MACHINE\n" +
                "- 0 CLUES ABOUT MY CREATOR"

        }),

        secret: () => ({

            type: "success",

            message:
                "HIDDEN MESSAGE UNLOCKED!\n" +
                "YOU ARE CURIOUS ENOUGH TO BE AN INVENTOR.\n" +
                "BYTE'S MESSAGE: NEVER STOP BUILDING."

        }),

        clear: () => {

            if (terminalHistory) {
                terminalHistory.replaceChildren();
            }

            return {
                message: "TERMINAL CLEARED. READY FOR YOUR NEXT COMMAND."
            };

        }

    };


    function addTerminalLine(message, type = "") {

        if (!terminalHistory) return;

        const line = document.createElement("p");

        line.className = `terminal-line ${type}`;

        line.textContent = message;

        terminalHistory.appendChild(line);


        // Keep terminal history limited.

        while (terminalHistory.children.length > 30) {

            terminalHistory.firstElementChild.remove();

        }


        line.scrollIntoView({
            block: "nearest"
        });

    }


    if (terminalForm && terminalInput) {

        terminalForm.addEventListener("submit", event => {

            event.preventDefault();

            const command = terminalInput.value
                .trim()
                .toLowerCase();

            if (!command) return;

            addTerminalLine(
                `> ${command}`,
                "command"
            );

            terminalInput.value = "";


            if (
                Object.prototype.hasOwnProperty.call(
                    terminalCommands,
                    command
                )
            ) {

                const result =
                    terminalCommands[command]();

                if (result.message) {

                    addTerminalLine(
                        result.message,
                        result.type || ""
                    );

                }

                if (command === "secret") {

                    showToast(
                        "SECRET MESSAGE DISCOVERED!"
                    );

                }

            } else {

                addTerminalLine(
                    `UNKNOWN COMMAND: "${command}". TYPE HELP.`,
                    "error"
                );

            }

        });

    }


    // =========================================
    // 9. PROJECT INFORMATION
    // =========================================

    const projectModalTitle =
        $("#project-modal-title");

    const projectModalBody =
        $("#project-modal-body");


    const projectInfo = {

        playground: {

            title: "PIXEL PLAYGROUND",

            description:
                "Welcome to Byte's creative sandbox. Collect glowing pixels to help rebuild the forgotten digital universe.",

            intro:
                "Every pixel you collect restores a tiny piece of the lost world."

        },

        emotion: {

            title: "EMOTION ENGINE",

            description:
                "Byte is experimenting with emotions. Try different moods and see how the robot reacts.",

            intro:
                "Choose a mood to run a new emotional experiment."

        },

        garden: {

            title: "GLITCH GARDEN",

            description:
                "A digital garden has been corrupted by glitches. Help Byte repair it by collecting glowing pixels.",

            intro:
                "Every repaired pixel helps the garden bloom again."

        }

    };


    // =========================================
    // 10. PIXEL MINI-GAME
    // =========================================

    let gameScore = 0;
    const gameTarget = 8;

    let gameStarted = false;

    let gameBoard;
    let gameScoreElement;
    let gameMessageElement;


    function createGameMarkup(projectKey) {

        const info = projectInfo[projectKey];

        if (!projectModalTitle || !projectModalBody) {
            return;
        }

        projectModalTitle.textContent = info.title;

        projectModalBody.replaceChildren();


        const description = document.createElement("p");

        description.textContent = info.description;


        const intro = document.createElement("p");

        intro.textContent = info.intro;


        projectModalBody.append(
            description,
            intro
        );


        if (projectKey === "emotion") {

            createEmotionExperiment();

        } else {

            createPixelGame(projectKey);

        }

    }


    function createPixelGame(projectKey) {

        const game = document.createElement("div");

        game.className = "mini-game";


        const score = document.createElement("p");

        score.className = "game-score";

        gameScoreElement = score;


        const board = document.createElement("div");

        board.className = "pixel-game-board";

        gameBoard = board;


        const message = document.createElement("p");

        message.className = "game-message";

        gameMessageElement = message;


        const actions = document.createElement("div");

        actions.className = "game-actions";


        const startButton = document.createElement("button");

        startButton.type = "button";

        startButton.className = "game-action";

        startButton.textContent = "START / RESET";


        startButton.addEventListener("click", () => {

            startPixelGame(projectKey);

        });


        const closeButton = document.createElement("button");

        closeButton.type = "button";

        closeButton.className = "game-action";

        closeButton.textContent = "CLOSE EXPERIMENT";


        closeButton.addEventListener("click", () => {

            closeModal(projectModal);

        });


        actions.append(
            startButton,
            closeButton
        );


        game.append(
            score,
            board,
            message,
            actions
        );


        projectModalBody.appendChild(game);

        startPixelGame(projectKey);

    }


    function startPixelGame(projectKey) {

        gameScore = 0;

        gameStarted = true;

        if (
            !gameBoard ||
            !gameScoreElement ||
            !gameMessageElement
        ) {
            return;
        }

        gameBoard.replaceChildren();


        gameScoreElement.textContent =
            `PIXELS RESTORED: ${gameScore}/${gameTarget}`;


        gameMessageElement.textContent =
            projectKey === "garden"
                ? "REPAIR THE GARDEN BY COLLECTING PIXELS."
                : "COLLECT GLOWING PIXELS TO REBUILD THE WORLD.";


        // Choose one special pixel.

        const specialIndex =
            Math.floor(Math.random() * 64);


        for (let i = 0; i < 64; i++) {

            const pixel = document.createElement("button");

            pixel.type = "button";

            pixel.className = "game-pixel";

            pixel.setAttribute(
                "aria-label",
                `Pixel ${i + 1}`
            );


            if (i === specialIndex) {

                pixel.classList.add("special");

                pixel.setAttribute(
                    "aria-label",
                    "Special glowing pixel"
                );

            }


            pixel.addEventListener("click", () => {

                if (
                    !gameStarted ||
                    pixel.classList.contains("collected")
                ) {
                    return;
                }


                pixel.classList.add("collected");

                pixel.disabled = true;

                gameScore++;


                gameScoreElement.textContent =
                    `PIXELS RESTORED: ${gameScore}/${gameTarget}`;


                if (gameScore >= gameTarget) {

                    gameStarted = false;


                    gameMessageElement.textContent =
                        projectKey === "garden"
                            ? "GARDEN RESTORED! BYTE IS PROUD OF YOU."
                            : "MISSION COMPLETE! YOU HELPED REBUILD THE WORLD.";


                    showToast("EXPERIMENT COMPLETE!");

                    return;

                }


                gameMessageElement.textContent =
                    "NICE WORK! KEEP COLLECTING.";

            });


            gameBoard.appendChild(pixel);

        }

    }


    // =========================================
    // 11. EMOTION ENGINE
    // =========================================

    function createEmotionExperiment() {

        const game = document.createElement("div");

        game.className = "mini-game";


        const message = document.createElement("p");

        message.className = "game-message";

        message.textContent =
            "SELECT A MOOD TO SEE BYTE'S REACTION.";


        const actions = document.createElement("div");

        actions.className = "game-actions";


        const choices = [

            {
                label: "HAPPY",

                response:
                    "BYTE: WOW! THIS FEELS LIKE FINDING A SECRET ROOM IN MY OWN BRAIN.",

                mood: "happy"
            },

            {
                label: "SLEEPY",

                response:
                    "BYTE: INITIATING NAP.EXE... PLEASE WAKE ME WHEN THE WIFI RETURNS.",

                mood: "sleepy"
            },

            {
                label: "CURIOUS",

                response:
                    "BYTE: WHAT IS THAT? HOW DOES IT WORK? CAN I TAKE IT APART?",

                mood: "curious"
            }

        ];


        choices.forEach(choice => {

            const button = document.createElement("button");

            button.type = "button";

            button.className = "game-action";

            button.textContent = choice.label;


            button.addEventListener("click", () => {

                message.textContent = choice.response;

                setRobotMood(choice.mood);

            });


            actions.appendChild(button);

        });


        game.append(
            message,
            actions
        );


        projectModalBody.appendChild(game);

    }


    // Open the selected project.

    $$(".project-button").forEach(button => {

        button.addEventListener("click", () => {

            const projectKey = button.dataset.project;

            if (
                !Object.prototype.hasOwnProperty.call(
                    projectInfo,
                    projectKey
                )
            ) {
                return;
            }

            createGameMarkup(projectKey);

            openModal(projectModal);

        });

    });


    // =========================================
    // 12. FINAL HELLO BUTTON
    // =========================================

    const finalHelloButton = $("#final-hello");

    if (finalHelloButton) {

        finalHelloButton.addEventListener("click", () => {

            setRobotMood("happy");

            changeRobotMessage(
                "HEY HUMAN! THANKS FOR VISITING MY LITTLE UNIVERSE. ♥"
            );


            const home = $("#home");

            if (home) {

                home.scrollIntoView({
                    behavior: "smooth"
                });

            }


            showToast("BYTE SAYS: YOU'RE AWESOME!");

        });

    }


    // =========================================
    // 13. SECRET KEYBOARD EASTER EGG
    // =========================================

    const secretSequence = [
        "b",
        "y",
        "t",
        "e"
    ];

    let sequencePosition = 0;
    let sequenceTimer;


    document.addEventListener("keydown", event => {

        if (
            event.ctrlKey ||
            event.altKey ||
            event.metaKey ||
            event.key.length !== 1
        ) {
            return;
        }


        const target = event.target;


        if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target.isContentEditable
        ) {
            return;
        }


        const key = event.key.toLowerCase();


        if (key === secretSequence[sequencePosition]) {

            sequencePosition++;

            clearTimeout(sequenceTimer);


            sequenceTimer = setTimeout(() => {

                sequencePosition = 0;

            }, 1800);


            if (
                sequencePosition ===
                secretSequence.length
            ) {

                sequencePosition = 0;

                clearTimeout(sequenceTimer);


                showToast(
                    "SECRET UNLOCKED: YOU FOUND BYTE'S KEY!"
                );


                openModal(terminalModal);


                addTerminalLine(
                    "SPECIAL ACCESS GRANTED. TYPE SECRET TO READ BYTE'S MESSAGE.",
                    "success"
                );

            }

        } else {

            sequencePosition =
                key === secretSequence[0] ? 1 : 0;

        }

    });


    // =========================================
    // 14. CONSOLE WELCOME
    // =========================================

    console.log(
        "%cBYTE.EXE",
        "color:#43f5e6;font-size:24px;font-weight:bold;"
    );

    console.log(
        "%cWelcome, curious human.",
        "color:#a78bfa;font-size:14px;"
    );

    console.log(
        "Explore the website, click Byte, and try the secret terminal."
    );


});
// ========================================
// BYTE'S EYE TRACKING SYSTEM
// ========================================

const byteRobot = document.getElementById("byte-robot");
const robotScene = document.getElementById("robot-scene");

if (byteRobot && robotScene) {
    const robotEyes = byteRobot.querySelectorAll(".robot-eye");

    const MAX_MOVE = 4;

    robotScene.addEventListener("mousemove", (event) => {
        const rect = byteRobot.getBoundingClientRect();

        // Robot ke face ka approximate center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height * 0.3;

        // Mouse ki position relative to robot
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;

        // Movement ko limited rakho
        const moveX = Math.max(
            -MAX_MOVE,
            Math.min(MAX_MOVE, deltaX / 20)
        );

        const moveY = Math.max(
            -MAX_MOVE,
            Math.min(MAX_MOVE, deltaY / 20)
        );

        robotEyes.forEach((eye) => {
            eye.style.setProperty("--eye-x", `${moveX}px`);
            eye.style.setProperty("--eye-y", `${moveY}px`);
        });
    });

    robotScene.addEventListener("mouseleave", () => {
        robotEyes.forEach((eye) => {
            eye.style.setProperty("--eye-x", "0px");
            eye.style.setProperty("--eye-y", "0px");
        });
    });
}