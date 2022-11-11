const tetrisWrap = document.querySelector(".tetris__wrap");
const playground = tetrisWrap.querySelector(".playground > ul");
const tetrisStart = tetrisWrap.querySelector(".tetris__start");
const startBtn = tetrisWrap.querySelector(".start__btn");
const tetrisRestart = tetrisWrap.querySelector(".tetris__restart");
const restartBtn = tetrisWrap.querySelector(".restart__btn");
const resultTime = tetrisWrap.querySelector(".tetris__total .time span");
const resultLine = tetrisWrap.querySelector(".tetris__total .line span");
const resultScore = tetrisWrap.querySelector(".tetris__score span");
const tetrisInfo = tetrisWrap.querySelector(".tetris__info");
const tetrisIcon2 = document.querySelector(".icon4");
const tetrisCloseBtn = document.querySelector(".tetris__close__btn");
const tetrisGif = document.querySelector(".tetris__gif");
let tetrisMusic = new Audio("../assets/audio/RetroGamer.mp3");
let tetrisMatchMusic = new Audio("../assets/audio/match2.mp3");
let tetrisEndMusic = new Audio("../assets/audio/up.mp3");

// variables
let rows = 20;
let cols = 12; // 난이도의 유동성을 위해 행과 열의 갯수를 변수에 저장함. 해당 값을 바꾸면 됨.

let tetrisScore = 0;
let duration = 500;
let downInterval;
let tempMovingItem;
let tetrisTime = 0;
let stopTetris = false;
let setTetrisTime;

// 블록 정보
const movingItem = {
  type: "Tmino", // 블록 이름
  direction: 0, // 블록의 모양을 지정해줄 정보
  top: 0, // 위에서의 좌푯값
  left: 5, // 왼쪽에서의 좌푯값
};

// 블럭의 모양을 만들어줄 좌표값을 저장해 줍니다.
const blocks = {
  Tmino: [
    [
      [2, 1],
      [0, 1],
      [1, 0],
      [1, 1],
    ], // Tmino의 기본 모양
    [
      [2, 1],
      [1, 2],
      [1, 0],
      [1, 1],
    ], // Tmino의 돌아간 모양2
    [
      [1, 2],
      [0, 1],
      [2, 1],
      [1, 1],
    ], // Tmino의 돌아간 모양3
    [
      [1, 2],
      [0, 1],
      [1, 0],
      [1, 1],
    ], // Tmino의 돌아간 모양4
  ],
  Imino: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  ],
  Omino: [
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  ],
  Zmino: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
  ],
  Smino: [
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  ],
  Jmino: [
    [
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
  ],
  Lmino: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 0],
      [2, 1],
    ],
  ],
};

// 시작하기
function init() {
  // 블록의 정보를 저장
  tempMovingItem = { ...movingItem };

  // i의 범위 지정은 만들고싶은 컷번째 li의 갯수만큼
  for (let i = 0; i < rows; i++) {
    prependNewLine(); //테트리스 라인 만들기
  }
  // renderBlocks()      //블록 출력하기
  // generateNewBlock()  //새로운 블록 만들기(+n초마다 내려가게)
}

// 블록 만들기
function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  // j의 범위 지정은 만들고 싶은 두번째 li의 갯수만큼
  for (let j = 0; j < cols; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playground.prepend(li);
}

// 블록 출력하기
// moveType을 매개변수로 받아오면 해당 값을 저장하고 아닌 경우 공백으로 넘어갈 수 있음.
// 매개변수를 보내지 않는 경우가 있을 때 활용합시다.
function renderBlocks(moveType = "") {
  if (!stopTetris) {
    // 기본
    // const ty = tempMovingItem.type;
    // const di = tempMovingItem.direction;
    // const to = tempMovingItem.top;
    // const le = tempMovingItem.left;

    // 객체구조분해할당
    // 블록의 각 정보를 출력하기 위함
    const { type, direction, top, left } = tempMovingItem;

    // 움직이는 블록이 이동되면 이전에 있던 블록을 없애주기 위해 forEach문을 통해 있던 블록을 삭제해 줍니다.
    // 이후 새로운 블록이 출력되기 때문에 이동된 것처럼 보입니다.
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach((moving) => {
      moving.classList.remove(type, "moving");
    });

    // console.log(blocks[type][direction])
    // 4개를 모두 출력하기 위해 forEach반복문을 사용합니다.
    // forEach는 반복을 멈출 수 없지만, some은 return을 쓸 수 있기 때문에 반복문이면서 멈출 수 있습니다.
    blocks[type][direction].some((block) => {
      const x = block[0] + left; // 2, 0, 1, 1
      const y = block[1] + top; // 1, 1, 0, 1

      // playground의 y번째 li의 자식 ul의 x번째 li를 선택합니다.
      // 범위를 벗어나는 경우 오류가 생기기 때문에, 삼항연산자를 이용하여 리스트의 값(playground.childNodes[y])이 비었는지(null | undefined) 확인하고 실행문을 실행합니다.
      const target = playground.childNodes[y]
        ? playground.childNodes[y].childNodes[0].childNodes[x]
        : null;
      const isAvailabe = checkEmpty(target);

      // 테두리 바깥에 나으로 나가지 않도록 if문을 이용하여 조건을 지정해 줍니다.
      if (isAvailabe) {
        // 테두리에 도달하지 않음. 정상영역
        target.classList.add(type, "moving"); // 클래스를 추가해 블록이 보이도록 해줍니다.
      } else {
        //테두리에 도달한 경우 위치 값에 이동하는 값을 새로 넣지 않고 원래의 값을 넣어줍니다.
        tempMovingItem = { ...movingItem };
        // setTimeout을 통해 한번 제동을 걸어주어 재귀함수가 무한에 빠지는 것을 방지합니다.
        setTimeout(() => {
          renderBlocks();
          if (moveType === "top") {
            seizeBlock();
          }
        }, 0);

        return true;
      }

      // target.classList.add(type, "moving")
    });

    // 키다운을 할 때마다 위치 값을 갱신해 주어서, 끝에 도달해 위치 값을 초기화 시킬 때
    // 초기 설정 값이 아닌 현재의 위치로 이동되도록 합니다.
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
  }
}




// 블록이 바닥에(or 서로) 닿았는지 감지하기
function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  // 줄이 채워졌는지 확인합니다.
  checkMatch();
}

// 꽉 채운 줄 제거하기
function checkMatch() {
  // playground의 자식요소를 선택
  const childNodes = playground.childNodes;

  // 게임이 끝났을 때
  childNodes[0].children[0].childNodes.forEach((li) => {
    if (li.classList.contains("seized")) {
      stopTetris = true;
      tetrisEndMusic.play();
      tetrisGameover();
    }
  });
  childNodes.forEach((child) => {
    let matched = true; //트리거 변수를 만들어 줍니다.

    // child(li)의 0번째 자식(ul)의 모든 li를 대상으로 반복문을 실행합니다.
    child.children[0].childNodes.forEach((li) => {
      // 모든 li에 sezied가 잇는 경우 match는 true, 아닌 경우엔 해당 if문이 실행되어
      // match는 false가 됩니다.
      if (!li.classList.contains("seized")) {
        matched = false;
      }
    });

    // match가 true인 경우, 꽉 채운 해당 줄을 삭제하고, 새로 한 줄을 추가합니다.
    if (matched) {
      tetrisMatchMusic.play();
      child.remove(); // 줄 삭제
      prependNewLine(); // 줄 생성
      tetrisScore++;
      document.querySelector(".tetris__info .line span").innerText =
        tetrisScore;
    }
  });

  // 새로운 블록을 생성합니다.
  generateNewBlock();
}

// 새로운 블록 만들기
function generateNewBlock() {
  // 계속해서 빨라지지 않도록 setInterval()을 없애줍니다.
  clearInterval(downInterval);

  // duration마다 1칸씩 내려가도록 합니다.
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, duration);

  // 랜덤한 index를 만들어 블록의 모양을 랜덤하게 뿌리도록 해줍니다.
  const blockArray = Object.entries(blocks);
  const randomIndex = Math.floor(Math.random() * blockArray.length);
  movingItem.type = blockArray[randomIndex][0];

  // 새로운 블록이 만들어지면 초기 위치에 생성되도록 값을 초기 설정값으로 초기화 시켜줍니다.
  movingItem.top = 0;
  movingItem.left = 5;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
}

// 빈칸 확인하기
function checkEmpty(target) {
  // 타겟이 빈경우 false를 반환, 아닌 경우 true를 반환
  if (!target || target.classList.contains("seized")) {
    return false;
  }
  return true;
}

// 블록 움직이기
function moveBlock(moveType, amount) {
  // 해당하는 방향으로 값을 추가하여줍니다.
  tempMovingItem[moveType] += amount;
  // 바뀐 값을 토대로 블록을 출력하면 이동이 됩니다.
  renderBlocks(moveType);
}

// 블록 모양 바꾸기
function changeDirection() {
  // direction에 현재 블록의 모양을 저장합니다.
  const direction = tempMovingItem.direction;
  // 마지막 모양으로 바뀐 경우 처음의 모양으로 돌려주기
  direction === 3
    ? (tempMovingItem.direction = 0)
    : (tempMovingItem.direction += 1);
  // 마찬가지로 renderBlocks()함수를 실행해 주어야 모양이 바로바로 바뀝니다.
  renderBlocks();
}

// 블록 빨리 내리기
function dropBlock() {
  // 한번만 빨리 내리고 끝나기 때문에 clearInterval()을 해줍니다.
  clearInterval(downInterval);

  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 10);
}

// 시간 설정하기
function setTime() {
  setTetrisTime = setInterval(() => {
    tetrisTime++;
    document.querySelector(".tetris__info .time span").innerText = tetrisTime;
  }, 1000);
}

// 게임 오버
function tetrisGameover() {
  tetrisMusic.pause();
  tetrisMusic.currentTime = 0;
  clearInterval(setTetrisTime);
  tetrisInfo.classList.remove("show");
  tetrisGif.classList.remove("show");
  tetrisRestart.classList.add("show");
  resultTime.innerText = tetrisTime;
  resultLine.innerText = tetrisScore;
  resultScore.innerText = tetrisTime + tetrisScore * 5;
}

// 게임 시작하기
function tetrisStartFunc() {
  stopTetris = false;
  tetrisStart.classList.remove("show");
  tetrisInfo.classList.add("show");
  tetrisGif.classList.add("show");
  document.querySelector(".tetris__restart").classList.remove("show");
  generateNewBlock();
  setTime();
  tetrisMusic.play();
  tetrisMusic.loop = true;
}

// 리셋하기
function resetTetris() {
  tetrisMusic.pause();
  tetrisMusic.currentTime = 0;
  tetrisInfo.classList.remove("show");
  clearInterval(setTetrisTime);
  tetrisScore = 0;
  tetrisTime = 0;
  stopTetris = true;
  document.querySelector(".tetris__info .time span").innerText = tetrisTime;

  const tetrisMinos = playground.querySelectorAll("li > ul > li");
  tetrisMinos.forEach((minos) => {
    minos.className = "";
  });
}

// 해당하는 키보드를 누르면 움직이거나 모양이 바뀌도록 이벤트를 만들어 줍니다.
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39: // 오른쪽 화살표를 누른 경우
      moveBlock("left", 1); // 이동하기 함수 실행
      break;
    case 37: // 왼쪽 화살표를 누른 경우
      moveBlock("left", -1);
      break;
    case 40: // 아래 화살표를 누른 경우
      moveBlock("top", 1);
      break;
    case 38: // 위 화살표를 누른 경우
      changeDirection(); // 모양 바꾸기 함수 실행
      break;
    case 32: // 스페이스바를 누른 경우
      dropBlock(); // 빨리 내리기 함수 실행
      break;
    default:
      break;
  }
});

// 클릭 이벤트
// 게임 시작하기
startBtn.addEventListener("click", () => {
  tetrisStartFunc();
});
// 게임 재시작하기
restartBtn.addEventListener("click", () => {
  resetTetris();
  tetrisRestart.classList.remove("show");
  tetrisStart.classList.add("show");
});
// 창 끄기
tetrisIcon2.addEventListener("click", () => {
  resetTetris();
  tetrisRestart.classList.remove("show");
  tetrisStart.classList.add("show");
});
tetrisCloseBtn.addEventListener("click", () => {
  resetTetris();
  tetrisRestart.classList.remove("show");
  tetrisStart.classList.add("show");
});

// 테마 바꾸기
// const temBtn01 = document.querySelector(".tem01");
// const temBtn02 = document.querySelector(".tem02");
// const temBtn03 = document.querySelector(".tem03");

// temBtn01.addEventListener("click", () => {
  // alert("aaa")
  // document.querySelector(".Tmino").style.border = "6px #19005285 outset !important";
// });

// 테트리스 만들기
init();