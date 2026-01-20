let instruct = document.querySelector(".instruction");
let body = document.querySelector("body");
let count = 0;
let time = document.querySelector(".timer");
let isAnimating = false;
let boxarr = [];
let lives = 3;
let live = document.querySelector(".hearts");
let cnt = 0;
let grid = document.querySelector(".main-box");
let main = document.querySelector(".main");
let arr = [
  "This is a Math typing game",
  "Please make a mental note of the indexes<br> of the grid that's about to be shown",
  "You are required to perform <br>mathematical operations  on the indexes of the <br>highlighted boxes  and type them asap",
  "You move in a time constraint <br> with only room for 3 errors",
  ` <input type="text" placeholder="Enter your username" class="inp">`,
];
let realboxarr = [];
let liv;
let eqn = document.querySelector(".equation");
let ifon = true;
let id;
let score = 0;
let realscore = 0;
let l = 1;
let playerdata;
let highscore = document.querySelector(".highscore");
let usernameKey;
let bil;
let dummyInput = document.getElementById("dummy-keyboard");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
main.style.display = "none";

//Animation for the inctruction sequence

function addinsrtuct(a) {
  setTimeout(function () {
    instruct.innerHTML = arr[a];
  }, 2000);
  setTimeout(function () {
    instruct.classList.remove("ripple-target");
    isAnimating = false;
  }, 3500);
}

//Animation for the cube waves

function runAnimation(a) {
  grid.classList.add("trigger-wave");

  setTimeout(function () {
    grid.classList.remove("trigger-wave");
  }, 3000);

  setTimeout(() => {
    realboxarr.forEach((e) => {
      e.classList.add("text-fade");
    });
  }, 10);
  if (a) {
    document.documentElement.style.setProperty("--color", `#00ff37`);
  } else {
    document.documentElement.style.setProperty("--color", `#00d2ff`);
  }
}

//To create the grids

function create(l) {
  let c;
  let r;
  let n;
  grid.innerHTML = "";
  live.innerHTML = "";
  time.innerHTML = "00:00";
  if (l === 1) {
    n = 100;
    r = 3;
    c = 3;
  } else if (l === 2) {
    n = 90;
    r = 4;
    c = 4;
  } else if (l === 3) {
    n = 80;
    r = 5;
    c = 5;
  }

  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      const box = document.createElement("div");
      box.classList.add("box");

      const diagonalIndex = i + j;
      box.style.setProperty("--d", diagonalIndex);

      grid.appendChild(box);
    }
  }
  for (let i = 0; i < 3; i++) {
    const li = document.createElement("div");
    li.classList.add("heart");
    live.appendChild(li);
  }
  liv = document.querySelectorAll(".heart");
  document.documentElement.style.setProperty(
    "--grid-columns",
    `repeat(${r}, ${n}px)`,
  );
  document.documentElement.style.setProperty(
    "--grid-rows",
    `repeat(${r}, ${n}px)`,
  );
  realboxarr = document.querySelectorAll(".box");
  for (let i = 0; i < r; i++) {
    realboxarr[i].innerHTML = i + 1;
    realboxarr[r * i].innerHTML = i + 1;
  }
}

// A timer function

function timer(l) {
  clearInterval(id);
  let a;
  if (l === 1) a = 120;
  else if (l == 2) a = 200;
  else if (l === 3) a = 600;
  let countersec = 0;
  let countermin = 0;
  score = a;
  let displayMin = countermin < 10 ? "0" + countermin : countermin;
  let displaySec = countersec < 10 ? "0" + countersec : countersec;

  time.innerHTML = displayMin + ":" + displaySec;
  id = setInterval(function () {
    countersec++;

    if (countersec === 60) {
      countersec = 0;
      countermin++;
    }

    displayMin = countermin < 10 ? "0" + countermin : countermin;
    displaySec = countersec < 10 ? "0" + countersec : countersec;

    time.innerHTML = displayMin + ":" + displaySec;
    if (countermin * 60 + countersec == a) {
      ifon = false;
      document.dispatchEvent(new Event("TIMEUP"));
      clearInterval(id);
    }
    score--;
  }, 1000);
}

//To pick the random boxes from the remaining ones

function RNG() {
  if (boxarr.length === 0) return 0;

  let RIG = Math.floor(Math.random() * boxarr.length);
  return boxarr.splice(RIG, 1)[0];
}

//Create the box array to pick from

function start(l) {
  let length;
  if (l === 1) length = 9;
  else if (l === 2) length = 16;
  else if (l === 3) length = 25;
  boxarr = [];
  for (let i = 1; i <= length; i++) {
    boxarr.push(i);
  }
}

//To generate the random equation

function eqngen(a, l) {
  if (l === 1) r = 3;
  else if (l === 2) r = 4;
  else if (l === 3) r = 5;

  let x = ((a - 1) % r) + 1;
  let y = Math.floor((a - 1) / r) + 1;
  let first = Math.floor(Math.random() * 10);
  let second = Math.floor(Math.random() * 10);
  let ans;
  if (Math.random() > 0.5) {
    ans = first * x + second * y;
    console.log(ans);
    return [ans, `x*${first}+y*${second}`];
  } else {
    ans = first * x - second * y;
    console.log(ans);
    if (ans < 0) {
      ans = -ans;
      return [ans, `y*${second}-x*${first}`];
    }
    return [ans, `x*${first}-y*${second}`];
  }
}

function redlife() {
  liv[cnt++].style.display = "none";
  lives--;
}

//To listen for the keyboard where a simple eventlistener won't fit

function waitForEnter() {
  return new Promise((resolve) => {
    function handler(e) {
      if (e.key === "Enter") {
        document.body.removeEventListener("keydown", handler);
        resolve();
      }
    }

    document.body.addEventListener("keydown", handler);
  });
}

//To listen for the keyboard where a simple eventlistener won't fit

function waitForInput(targetAnswer) {
  return new Promise((resolve) => {
    let currentInput = "";
    const handler = function (e) {
      currentInput += e.key;
      if (e.key.length > 1) return;

      let targetStr = targetAnswer.toString();

      if (
        currentInput[currentInput.length - 1] !==
        targetStr[currentInput.length - 1]
      ) {
        cleanup();
        resolve(false);
        return;
      }

      if (currentInput === targetStr) {
        cleanup();
        resolve(true);
        return;
      }
    };
    const timehandler = function () {
      cleanup();
      resolve(false);
      return;
    };

    function cleanup() {
      document.body.removeEventListener("keydown", handler);
      document.removeEventListener("TIMEUP", timehandler);
    }

    document.body.addEventListener("keydown", handler);
    document.addEventListener("TIMEUP", timehandler);
  });
}

//For smaller devices with no physical keyboards

window.addEventListener("click", function() {
    dummyInput.focus();
});

//For smaller devices with no physical keyboards

dummyInput.addEventListener("input", function() {
    this.value = "";
});

body.addEventListener("keydown", function (e) {
  if (isAnimating) return;

  if (count < 5) {
    if (e.key === "Enter") {
      isAnimating = true;
      instruct.classList.add("ripple-target");

      addinsrtuct(count++);
    }
  } else if (count === 5) {
    let inp = document.querySelector(".inp");
    inp.focus();
    if (e.key === "Enter") {
      if (inp.value === "") {
        alert("Please enter any username");
        return;
      }
      if (!localStorage.getItem(inp.value)) {
        playerdata = {
          l: 1,
          realscore: 0,
          score: 0,
          ifcompleted: false,
        };
        l = playerdata.l;
        realscore = playerdata.realscore;
        score = playerdata.score;
        bil = playerdata.ifcompleted;
        localStorage.setItem(inp.value, JSON.stringify(playerdata));
      } else {
        try {
          playerdata = JSON.parse(localStorage.getItem(inp.value));
        } catch (e) {
          playerdata = { l: 1, realscore: 0, score: 0, ifcompleted: false };
        }
        l = playerdata.l;
        realscore = playerdata.score;
      }
      if (playerdata.ifcompleted) {
        highscore.innerHTML = `Highscore: ${realscore}`;
        if (l === 4) {
          l = 1;
          realscore = 0;
          score = 0;
        }
        bil = playerdata.ifcompleted;
      } else {
        highscore.innerHTML = "Yet to Complete";
      }

      usernameKey = inp.value;

      instruct.innerHTML = ``;

      instruct.style.display = "none";
      main.style.display = "";
      gamestart();
      count++;
    }
  }
});

async function gamestart() {
  while (true) {
    while (l < 4) {
      instruct.style.display = "none";
      instruct.classList.remove("ripple-target");
      lives = 3;
      cnt = 0;
      create(l);
      main.style.display = "";
      await sleep(3000);
      runAnimation(0);
      await sleep(1000);
      timer(l);
      ifon = true;

      start(l);
      while (lives > 0 && ifon) {
        let LOCRNG = RNG();
        let thearr = eqngen(LOCRNG, l);
        eqn.innerHTML = thearr[1];
        if (LOCRNG === 0) {
          realscore += score;
          l++;

          playerdata.l = l;
          playerdata.score = realscore;

          if (l > 3) {
            if (bil) {
              if (realscore > playerdata.realscore) {
                playerdata.realscore = realscore;
              }
            } else {
              playerdata.realscore = realscore;
              playerdata.ifcompleted = true;
              bil = true;
            }
          }

          localStorage.setItem(usernameKey, JSON.stringify(playerdata));
          runAnimation(1);
          await sleep(3000);

          break;
        }
        realboxarr[LOCRNG - 1].style.backgroundColor = "#00d2ff";
        let victory = await waitForInput(thearr[0]);
        if (victory) {
          realboxarr[LOCRNG - 1].style.backgroundColor = "#00ff37";

          continue;
        } else {
          realboxarr[LOCRNG - 1].style.backgroundColor = "#ff3700";
          realboxarr[LOCRNG - 1].style.animationDuration = "0s";
          redlife();

          continue;
        }
      }
      main.style.display = "none";
      instruct.style.display = "";

      if (lives == 0 || !ifon) {
        instruct.innerHTML = `Game Over<br>Press Enter to Restart`;
        await waitForEnter();
      } else if (l === 4) {
        break;
      } else {
        instruct.innerHTML = `Level Complete<br>Press Enter for Next Level`;
        await waitForEnter();
      }
      clearInterval(id);
      instruct.classList.add("ripple-target");
      await sleep(2000);
    }
    instruct.classList.remove("ripple-target");
    instruct.innerHTML = `GAME COMPLETED <br> SCORE:${playerdata.realscore}<br> Press Enter for again`;
    await waitForEnter();
    l = 1; 
    score = 0;
    realscore = 0;
    lives = 3;
  }
}
