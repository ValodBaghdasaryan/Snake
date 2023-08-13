const createLevelSelection = () => {
    const levelSection = document.querySelector(".level-selection");
    const lvl1Btn = document.querySelector(".level1");
    const lvl2Btn = document.querySelector(".level2");
    const lvl3Btn = document.querySelector(".level3");

    const hideLevelSelection = () => levelSection.style.display = "none";

    lvl1Btn.addEventListener("click", () => {
        hideLevelSelection();
        startGame(400, true);
    });

    lvl2Btn.addEventListener("click", () => {
        hideLevelSelection();
        startGame(200, false);
    });

    lvl3Btn.addEventListener("click", () => {
        hideLevelSelection();
        startGame(30, false);
    });
}

const startGame = (ms, allowInterceptArea) => {
    const food = document.querySelector(".food");
    const head = document.querySelector(".head");
    const area = document.querySelector(".area");
    const score = document.querySelector(".score");
    const gameSection = document.querySelector(".game");

    gameSection.style.display = "block";

    const GRID_SIZE = 30;

    const changeFoodPosition = () => {
        const x = Math.round(Math.random() * (GRID_SIZE - 1)) + 1;
        const y = Math.round(Math.random() * (GRID_SIZE - 1)) + 1;
        food.style.gridArea = `${y} / ${x}`;
    }

    let snakeX = 1;
    let snakeY = 1;
    let velocityX = 1;
    let velocityY = 0;

    const game = () => {
        snakeX += velocityX;
        snakeY += velocityY;

        const foodCordinate = food.style.gridArea.split("/");

        if (snakeX === +foodCordinate[1] && snakeY === +foodCordinate[0]) {
            changeFoodPosition();

            area.insertAdjacentHTML("afterbegin", "<div class=\"body\"></div>");
        }

        const bodies = Array.from(document.querySelectorAll(".body"));

        bodies.forEach((body, index) => {
            const next = bodies[index + 1] || head;

            body.style.gridArea = next.style.gridArea;
        });
        if (allowInterceptArea) {
            if (snakeX > 30) snakeX = 1;
            if (snakeY > 30) snakeY = 1;
            if (snakeX < 1) snakeX = 30;
            if (snakeY < 1) snakeY = 30;
        }

        const isInterceptBody = bodies.some(body => {
            const bodyCoordinates = body.style.gridArea.split("/");

            return snakeX === +bodyCoordinates[1] && snakeY === +bodyCoordinates[0];
        });

        const isInterceptArea = snakeX < 1 || snakeX > GRID_SIZE || snakeY < 1 || snakeY > GRID_SIZE

        if (isInterceptBody || isInterceptArea) {
            clearInterval(interval);

            alert("Game over");

            window.location.reload();

            return;
        }

        score.textContent = bodies.length;

        head.style.gridArea = `${snakeY} / ${snakeX}`;
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") alert("Stopped!");

        if (e.key === "ArrowRight") {
            if (velocityX === -1) return;

            velocityX = 1;
            velocityY = 0;
        } else if (e.key === "ArrowDown") {
            if (velocityY === -1) return;

            velocityX = 0;
            velocityY = 1;
        } else if (e.key === "ArrowLeft") {
            if (velocityX === 1) return;

            velocityX = -1;
            velocityY = 0;
        } else if (e.key === "ArrowUp") {
            if (velocityY === 1) return;

            velocityX = 0;
            velocityY = -1;
        }
    });

    const interval = setInterval(game, ms);

    changeFoodPosition();
}

createLevelSelection();