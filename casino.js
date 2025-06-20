let balance = parseInt(localStorage.getItem('casinoBalance')) || 1000;

const balanceDisplay = document.getElementById("balance");
const updateBalance = () => {
  balanceDisplay.textContent = balance;
  localStorage.setItem('casinoBalance', balance);
};

// COIN FLIP
const coinFlip = (choice) => {
  const flip = Math.random() < 0.5 ? 'heads' : 'tails';
  let result = '';
  if (choice === flip) {
    balance += 100;
    result = `You won! It was ${flip}. (+100)`;
  } else {
    balance -= 100;
    result = `You lost! It was ${flip}. (-100)`;
  }
  document.getElementById("coinResult").textContent = result;
  updateBalance();
};

// DICE ROLL
const rollDice = () => {
  const roll = Math.floor(Math.random() * 6) + 1;
  let result = '';
  if (roll >= 4) {
    balance += 150;
    result = `You rolled a ${roll}. You win! (+150)`;
  } else {
    balance -= 150;
    result = `You rolled a ${roll}. You lose! (-150)`;
  }
  document.getElementById("diceResult").textContent = result;
  updateBalance();
};

// CASE BATTLE
const openCase = () => {
  if (balance < 200) {
    document.getElementById("caseResult").textContent = "Not enough coins!";
    return;
  }
  balance -= 200;
  const items = [
    { name: "Common Skin", value: 100 },
    { name: "Rare Skin", value: 250 },
    { name: "Epic Skin", value: 500 },
    { name: "Legendary Skin", value: 1000 }
  ];
  const weights = [0.5, 0.3, 0.15, 0.05];
  const rand = Math.random();
  let sum = 0, item;
  for (let i = 0; i < items.length; i++) {
    sum += weights[i];
    if (rand <= sum) {
      item = items[i];
      break;
    }
  }
  balance += item.value;
  document.getElementById("caseResult").textContent = `You got a ${item.name}! (+${item.value})`;
  updateBalance();
};

// SLOT MACHINE
const playSlots = () => {
  if (balance < 150) {
    document.getElementById("slotResult").textContent = "Not enough coins!";
    return;
  }
  balance -= 150;
  const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];
  const slots = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];
  document.getElementById("slotDisplay").textContent = slots.join(" ");
  let result = "You lost. (-150)";
  if (slots[0] === slots[1] && slots[1] === slots[2]) {
    const winnings = 600;
    balance += winnings;
    result = `Jackpot! ${slots[0]} ${slots[1]} ${slots[2]} (+${winnings})`;
  }
  document.getElementById("slotResult").textContent = result;
  updateBalance();
};

// BLACKJACK
let playerCards = [], dealerCards = [], gameActive = false;

const getCard = () => Math.floor(Math.random() * 10) + 2;
const getTotal = (cards) => cards.reduce((a, b) => a + b, 0);

const startBlackjack = () => {
  if (balance < 200) {
    document.getElementById("blackjackStatus").textContent = "Not enough coins!";
    return;
  }
  balance -= 200;
  playerCards = [getCard(), getCard()];
  dealerCards = [getCard()];
  gameActive = true;
  updateBlackjack();
  updateBalance();
};

const updateBlackjack = () => {
  document.getElementById("blackjackCards").textContent =
    `Your cards: ${playerCards.join(", ")} (Total: ${getTotal(playerCards)})\nDealer shows: ${dealerCards[0]}`;
};

const hit = () => {
  if (!gameActive) return;
  playerCards.push(getCard());
  const total = getTotal(playerCards);
  updateBlackjack();
  if (total > 21) {
    document.getElementById("blackjackStatus").textContent = "Bust! You lose. (-200)";
    gameActive = false;
  }
};

const stand = () => {
  if (!gameActive) return;
  while (getTotal(dealerCards) < 17) dealerCards.push(getCard());
  const playerTotal = getTotal(playerCards);
  const dealerTotal = getTotal(dealerCards);
  let result = "";
  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    balance += 400;
    result = `You win! (+400)`;
  } else if (playerTotal < dealerTotal) {
    result = `You lose. (-200)`;
  } else {
    balance += 200;
    result = `Push. You get your coins back.`;
  }
  document.getElementById("blackjackStatus").textContent = result;
  document.getElementById("blackjackCards").textContent += `\nDealer: ${dealerCards.join(", ")} (Total: ${dealerTotal})`;
  gameActive = false;
  updateBalance();
};

const resetBalance = () => {
  balance = 1000;
  updateBalance();
};

updateBalance();
