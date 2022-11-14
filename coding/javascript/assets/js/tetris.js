const tetrisWrap = document.querySelector(".tetris__wrap");
const playground = tetrisWrap.querySelector(".playground > ul");

const tetrisStart = document.querySelector(".tetris__start");
const tetrisStartBtn = document.querySelector(".tetris__start .tetris__startBtn");
const tetrisMsg = document.querySelector(".tetrits__cover.show");

const tetrisRestart = tetrisWrap.querySelector(".tetris__restart");
const tetrisRestartBtn = tetrisWrap.querySelector(".tetris__restartBtn");
const tetrisInfo = tetrisWrap.querySelector(".tetris__info");
const resultScore = tetrisWrap.querySelector(".tetris__score span");

const resultTime = tetrisWrap.querySelector(".tetris__total .time span");
const resultLine = tetrisWrap.querySelector(".tetris__total .line span");

const TetrisIcon = document.querySelector(".icon4");
const TetrisWrap = document.querySelector(".tetris__wrap");
const TetrisClose = document.querySelector(".tetris__close");

// variables
let rows = 18;
let cols = 13;
let tetrisScore = 0;
let duration = 500;
let downInterval;
let tempMovingItem;
let tetrisTime = 0;
let stopTetris = false;
let setTetrisTime;
// 블록 정보
const movingItem = {
    type: "Imino",
    direction: 0, //블록 모양
    top: 0,
    left: 6,
};
// 블록 좌표값
const blocks = {
    Tmino : [
        [[2,1],[0,1],[1,0],[1,1]],
        [[1,2],[0,1],[1,0],[1,1]],
        [[1,2],[0,1],[2,1],[1,1]],
        [[2,1],[1,2],[1,0],[1,1]],
    ],
    Imino : [
        [[0,0],[0,1],[0,2],[0,3]],
        [[0,0],[1,0],[2,0],[3,0]],
        [[0,0],[0,1],[0,2],[0,3]],
        [[0,0],[1,0],[2,0],[3,0]],
    ],
    Omino : [
        [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[1,0],[1,1]],
    ],
    Zmino : [
        [[0,0],[1,0],[1,1],[2,1]],
        [[1,0],[0,1],[1,1],[0,2]],
        [[0,0],[1,0],[1,1],[2,1]],
        [[1,0],[0,1],[1,1],[0,2]],
    ],
    Smino : [
        [[1,0],[2,0],[0,1],[1,1]],
        [[0,0],[0,1],[1,1],[1,2]],
        [[1,0],[2,0],[0,1],[1,1]],
        [[0,0],[0,1],[1,1],[1,2]],
    ],
    Jmino : [
        [[0,2],[1,0],[1,1],[1,2]],
        [[0,0],[0,1],[1,1],[2,1]],
        [[0,0],[1,0],[0,1],[0,2]],
        [[0,0],[1,0],[2,0],[2,1]],
    ],
    Lmino : [
        [[0,0],[0,1],[0,2],[1,2]],
        [[0,0],[1,0],[2,0],[0,1]],
        [[0,0],[1,0],[1,1],[1,2]],
        [[0,1],[1,1],[2,0],[2,1]],
    ]
}

//게임시작 버튼


tetrisStartBtn.addEventListener("click", () => {
    tetrisMsg.classList.remove("show");

});

// 시작하기
function init() {
    tempMovingItem = { ...movingItem };

    for (let i = 0; i < rows; i++) {
    prependNewLine(); //블록 라인 만들기

     }
    // renderBlocks(); //블록 출력하기
    // moveBlock();
    generateNewBlock(); //블록 만들기
}
// 블록 만들기
function prependNewLine() {
    
        const li = document.createElement("li");
        const ul = document.createElement("ul");
        for (let j = 0; j < cols; j++) {
            const matrix = document.createElement("li");
            ul.prepend(matrix);
        }
        li.prepend(ul);
        playground.prepend(li);
    }

// 블록 출력하기
function renderBlocks(moveType = "") {
    if(!stopTetris){
        // const ty = tempMovingItem.type;
        // const di = tempMovingItem.direction;
        // const to = tempMovingItem.top;
        // const le = tempMovingItem.left;
        const { type, direction, top, left } = tempMovingItem;
        
        const movingBlocks = document.querySelectorAll(".moving");
        movingBlocks.forEach((moving) => {
            moving.classList.remove(type, "moving");
        });

        blocks[type][direction].some((block) => {
            const x = block[0] + left; //2 0 1 1
            const y = block[1] + top; //1 1 0 1
    
            const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
            const isAvailable = checkEmpty(target);
            
            if (isAvailable) {
                target.classList.add(type, "moving");
            } else {
                tempMovingItem = { ...movingItem };
    
    
                setTimeout(() => {
                    renderBlocks();
                    if(moveType === "top"){
                        seizeBlock();
                    }
                }, 0);
                return true;
            }
            // console.log({ playground });
        });
        movingItem.left = left;
        movingItem.top = top;
        movingItem.direction = direction;
    }
    }
    


//블록 감지하기
function seizeBlock() {
const movingBlocks = document.querySelectorAll(".moving");
movingBlocks.forEach(moving => {
    moving.classList.remove("moving");
    moving.classList.add("seized");

})
checkMatch()

}

//한 줄 제거하기

function checkMatch(){
    const childNodes = playground.childNodes;

        // 게임이 끝났을 때
    childNodes[0].children[0].childNodes.forEach((li) => {
        if (li.classList.contains("seized")) {
        stopTetris = true;
        tetrisGameover();
        }
    });

    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if(!li.classList.contains("seized")){
                matched = false;
            }
        });


        if(matched){
            child.remove();
            prependNewLine();
            tetrisScore++;
            document.querySelector(".tetris__info > p > span").innerText = tetrisScore;
    }
    });

    generateNewBlock()
}

//새로운 블록 만들기
function generateNewBlock(){

    clearInterval(downInterval);

    downInterval = setInterval(()=>{

        moveBlock("top", 1)

    }, duration)

    const blockArray = Object.entries(blocks);
    const randomIndex = Math.floor(Math.random() * blockArray.length);
    movingItem.type = blockArray[randomIndex][0];

    movingItem.top = 0;
    movingItem.left = 6;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };

    renderBlocks();
}

// 빈칸 감지
function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}
// 블록 움직이기
function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

//모양 바꾸기
function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction=0 : tempMovingItem.direction += 1;

    renderBlocks();
}

//빨리 내리기
function dropBlock() {
    clearInterval(downInterval);

    downInterval = setInterval(() => {
       moveBlock("top", 1) 
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
    clearInterval(setTetrisTime);
    duration = 500;
    tetrisInfo.classList.remove("show");
    tetrisRestart.classList.add("show");
    resultTime.innerText = tetrisTime;
  resultLine.innerText = tetrisScore;
    resultScore.innerText = tetrisScore;
    }

// 게임 시작하기
function tetrisStartFunc() {
    stopTetris = false;
    tetrisStart.classList.remove("show");
    tetrisInfo.classList.add("show");
    document.querySelector(".tetris__restart").classList.remove("show");
    generateNewBlock();
    setTime();
  }



  // 게임 시작하기
  tetrisStartBtn.addEventListener("click", () => {
    tetrisStartFunc();
  });

  // 리셋하기
function resetTetris() {

    tetrisInfo.classList.remove("show");
    clearInterval(setTetrisTime);
    tetrisScore = 0;
    tetrisTime = 0;
    stopTetris = true;
    duration = 500;
    document.querySelector(".tetris__info .time span").innerText = tetrisTime;
  
    const tetrisMinos = playground.querySelectorAll("li > ul > li");
    tetrisMinos.forEach((minos) => {
      // minos.className = "original";
      minos.className = "";
    });
  }

  // 게임 재시작하기
  tetrisRestart.addEventListener("click", () => {
    resetTetris();
    tetrisRestart.classList.remove("show");
    tetrisStart.classList.add("show");
  });
  // 창 끄기

    TetrisIcon.addEventListener("click", () => {
    resetTetris();
    TetrisWrap.classList.toggle("show");
    tetrisRestart.classList.remove("show");
    tetrisStart.classList.add("show");
  });
  TetrisClose.addEventListener("click", () => {
    resetTetris();
		TetrisWrap.classList.remove("show");
        tetrisRestart.classList.remove("show");
  });



// 이벤트
document.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 39:
            moveBlock("left", 1);
            break;

        case 37:
            moveBlock("left", -1);
            break;

        case 40:
            moveBlock("top", 1);
            break;

            case 38:
            changeDirection();
            break;

            case 32:
            dropBlock();
            break;

        default:
            break;
    }
});
init();

