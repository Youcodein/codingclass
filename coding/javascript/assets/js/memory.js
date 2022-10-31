// 01 html / css 구성
// 02 클릭한 카드 뒤집기
// 03 두개의 카드를 뒤집기 확인하기(첫번째,두번째)

const memoryWrap = document.querySelector(".memory__wrap");
const memoryCards = memoryWrap.querySelectorAll(".cards li");

let cardOne, cardTwo;
let disableDeck = false;
let matchedCard = 0;

let sound = [
  "../assets/audio/O.mp3",
  "../assets/audio/X.mp3",
  "../assets/audio/up.mp3",
];

let soundMatch = new Audio(sound[0]);
let soundUnMatch = new Audio(sound[1]);
let soundSuccess = new Audio(sound[2]);

//카드 뒤집기
function filpCard(e) {
  let clickedCard = e.target;

  if (clickedCard !== cardOne && !disableDeck) {
    clickedCard.classList.add("flip");

    if (!cardOne) {
      return (cardOne = clickedCard);
    }

    cardTwo = clickedCard;
    disableDeck = true;

    let cardOneImg = cardOne.querySelector(".back img").src;
    let cardTwoImg = cardTwo.querySelector(".back img").src;
    //   console.log(cardOneImg);
    matchCards(cardOneImg, cardTwoImg);
    // console.log(cardOneImg, cardTwoImg);
  }
}

//카드 확인(두개의 이미지 비교)
function matchCards(img1, img2) {
  //   console.log(img2);
  if (img1 == img2) {
    //같을 경우
    matchedCard++;
    // alert("이미지가 일치합니다");
    if (matchedCard == 8) {
      alert("게임 오버");
    }
    soundMatch.play();

    cardOne.removeEventListener("click", filpCard);
    cardTwo.removeEventListener("click", filpCard);
    cardOne = cardTwo = "";
    disableDeck = false;
  } else {
    // alert("이미지가 일치하지 않습니다.");
    //일치하지 않는경우(틀린 음악, 이미지가 좌우로 움직임)
    setTimeout(() => {
      cardOne.classList.add("shakeX");
      cardTwo.classList.add("shakeX");
    }, 500);

    setTimeout(() => {
      cardOne.classList.remove("shakeX", "flip");
      cardTwo.classList.remove("shakeX", "flip");
      cardOne = cardTwo = "";
      disableDeck = false;
    }, 1600);

    soundUnMatch.play();
  }
}

//카드 섞기
function shuffleCard() {
  cardOne = cardTwo = "";
  disableDeck = false;
  matchedCard = 0;

  let arr = [
    "balloon",
    "candyBox",
    "coffin",
    "frankentein",
    "owl",
    "spellbook",
    "voodoodoll",
    "witchHat",
    "balloon",
    "candyBox",
    "coffin",
    "frankentein",
    "owl",
    "spellbook",
    "voodoodoll",
    "witchHat",
  ];
  let result = arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  memoryCards.forEach((card, index) => {
    card.classList.remove("flip");

    setTimeout(() => {
      card.classList.add("flip");
    }, 200 * index);

    setTimeout(() => {
      card.classList.remove("flip");
    }, 4000);

    let imgTag = card.querySelector(".back img");
    imgTag.src = `../assets/img/memory_card_game/${arr[index]}.svg`;
  });
}
// shuffleCard();

//카드 클릭
memoryCards.forEach((card) => {
  card.addEventListener("click", filpCard);
});

//창닫기 버튼

const memoryIcon = document.querySelector(".icon3");
const memoryWrap1 = document.querySelector(".memory__wrap");
const memoryClose = document.querySelector(".memory__close");
memoryIcon.addEventListener("click", () => {
  memoryWrap1.classList.toggle("show");
});
memoryClose.addEventListener("click", () => {
  memoryWrap1.classList.remove("show");
});

//게임시작 버튼
const gameRule = document.querySelector(".memory__rules.show");
const gameStartBtn = document.querySelector(".memory__start__btn");

gameStartBtn.addEventListener("click", () => {
  gameRule.classList.remove("show");

  soundMatch.play();
  shuffleCard();
});
