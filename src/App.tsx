import React, { useState, useEffect } from "react";

type CardType = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const emojis = ["😊", "J", "😍", "🤔", "😎", "🥳", "😴", "K"];

// Load sound effects
const clickSound = new Audio("click.mp3");
const chimeSound = new Audio("chime.mp3");

const MemoryGame = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [firstCard, setFirstCard] = useState<CardType | null>(null);
  const [secondCard, setSecondCard] = useState<CardType | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    const initializeGame = () => {
      const duplicatedEmojis = [...emojis, ...emojis];
      const shuffledEmojis = duplicatedEmojis
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({
          id: index,
          emoji,
          flipped: false,
          matched: false,
        }));
      setCards(shuffledEmojis);
      setFirstCard(null);
      setSecondCard(null);
      setMoves(0);
      setGameOver(false);
    };

    initializeGame();
  }, []);

  useEffect(() => {
    if (firstCard && secondCard) {
      let newCards = [...cards];
      if (firstCard.emoji === secondCard.emoji) {
        chimeSound.play(); // 🔔 Play match sound
        newCards = newCards.map((card) =>
          card.emoji === firstCard.emoji ? { ...card, matched: true } : card
        );
        setCards(newCards);
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setGameOver(true);
    }
  }, [cards]);

  const handleCardClick = (card: CardType) => {
    if (!card.flipped && !card.matched) {
      clickSound.play(); // ✅ Play click sound
      if (!firstCard) {
        setFirstCard({ ...card, flipped: true });
      } else if (!secondCard) {
        setSecondCard({ ...card, flipped: true });
      }
    }
  };

  useEffect(() => {
    if (firstCard) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === firstCard.id ? { ...card, flipped: true } : card
        )
      );
    }
    if (secondCard) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === secondCard.id ? { ...card, flipped: true } : card
        )
      );
      setMoves((prevMoves) => prevMoves + 1);
    }
  }, [firstCard, secondCard]);

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setCards((prevCards) =>
      prevCards.map((card) =>
        !card.matched ? { ...card, flipped: false } : card
      )
    );
  };

  const handleRestartGame = () => {
    const duplicatedEmojis = [...emojis, ...emojis];
    const shuffledEmojis = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }));
    setCards(shuffledEmojis);
    setFirstCard(null);
    setSecondCard(null);
    setMoves(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">
        Emoji Memory Game 🧠
      </h1>
      <div className="mb-4 text-lg text-gray-700">Moves: {moves}</div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`w-24 h-24 cursor-pointer card ${
              card.flipped || card.matched ? "flipped" : ""
            }`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className="card-front"></div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="mt-8 p-4 bg-green-300 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">
            Congratulations! 🎉 You won in {moves} moves!
          </h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRestartGame}
          >
            Restart Game
          </button>
        </div>
      )}

      {!gameOver && (
        <button
          className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRestartGame}
        >
          Restart Game
        </button>
      )}
    </div>
  );
};

export default MemoryGame;
