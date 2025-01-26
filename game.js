// Initialize Kaboom.js
kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0.2, 0.6, 1, 1], // Sky blue background
});

// Constants
const MOVE_SPEED = 120;
const JUMP_FORCE = 400;
const ENEMY_SPEED = 50;
const FALL_DEATH = 500;

// Load assets
loadSprite("player", "https://i.imgur.com/zl6Eaf3.png"); // Player character
loadSprite("platform", "https://i.imgur.com/bdrLpi6.png"); // Platform
loadSprite("gem", "https://i.imgur.com/wbKxhcd.png"); // Gem
loadSprite("enemy", "https://i.imgur.com/3e5YRQd.png"); // Enemy

// Game logic
scene("game", ({ level, score }) => {
    layers(["bg", "obj", "ui"], "obj");

    const maps = [
        [
            "                           ",
            "                           ",
            "    ===       ===          ",
            "         @                 ",
            "   ===        ===          ",
            "                           ",
            "         ===         @     ",
            "===========================",
        ],
        [
            "                           ",
            "         ===               ",
            "             ===           ",
            "    ===         @          ",
            "         ===         ===   ",
            "     @                     ",
            "    ===   ===     ===      ",
            "===========================",
        ],
        [
            "                           ",
            "       ===                 ",
            "   ===       ===     @     ",
            "         @                 ",
            "   ===   ===   ===         ",
            "                           ",
            "      ===   ===     ===    ",
            "===========================",
        ],
    ];

    const levelCfg = {
        width: 20,
        height: 20,
        "=": [sprite("platform"), solid()],
        "@": [sprite("gem"), "gem"],
    };

    const gameLevel = addLevel(maps[level], levelCfg);

    const scoreLabel = add([
        text("Score: " + score),
        pos(10, 10),
        layer("ui"),
        {
            value: score,
        },
    ]);

    add([
        text("Level: " + (level + 1)),
        pos(200, 10),
        layer("ui"),
    ]);

    const player = add([
        sprite("player"),
        pos(30, 0),
        body(),
        origin("bot"),
    ]);

    // Player controls
    keyDown("left", () => {
        player.move(-MOVE_SPEED, 0);
    });

    keyDown("right", () => {
        player.move(MOVE_SPEED, 0);
    });

    keyPress("space", () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE);
        }
    });

    // Collect gems
    player.collides("gem", (g) => {
        destroy(g);
        scoreLabel.value++;
        scoreLabel.text = "Score: " + scoreLabel.value;
    });

    // Fall off screen
    player.action(() => {
        if (player.pos.y > FALL_DEATH) {
            go("lose", { score: scoreLabel.value });
        }
    });

    // Next level
    player.collides("platform", () => {
        if (player.pos.x > width() - 20 && level < maps.length - 1) {
            go("game", {
                level: level + 1,
                score: scoreLabel.value,
            });
        }
    });
});

// Lose scene
scene("lose", ({ score }) => {
    add([
        text(`Game Over!\nYour Score: ${score}`, 24),
        origin("center"),
        pos(width() / 2, height() / 2),
    ]);

    keyPress("space", () => {
        go("game", { level: 0, score: 0 });
    });
});

// Start the game
start("game", { level: 0, score: 0 });
