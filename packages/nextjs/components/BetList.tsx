import { useState } from "react"; // Импортируем useState для управления состоянием
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import EndBet from "~~/components/EndBet"; // Компонент для завершения ставки
import HasUserBet from "~~/components/HasUserBet"; // Компонент для проверки, сделал ли пользователь ставку

export default function BetList() {
  // Чтение количества существующих ставок
  const { data: betCount } = useScaffoldReadContract({
    contractName: "BettingContract", // Имя контракта
    functionName: "getBetCount", // Имя функции для получения количества ставок
  });

  // Функция для рендеринга списка ставок
  const renderBets = () => {
    if (betCount === undefined) return <p>Загрузка...</p>; // Проверяем на undefined, чтобы избежать ошибок
    const bets = [];
    for (let i = 0; i < betCount; i++) {
      bets.push(<BetItem key={i} betId={BigInt(i)} />); // Генерируем компоненты для каждой ставки
    }
    return bets;
  };

  return (
    <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Список ставок</h2>
      {betCount && betCount > 0 ? renderBets() : <p className="text-xl">Нет активных ставок</p>}
      {/* Если ставки есть, показываем их */}
    </div>
  );
}

// Компонент для каждой отдельной ставки
function BetItem({ betId }: { betId: bigint }) {
  const { data } = useScaffoldReadContract({
    contractName: "BettingContract", // Имя контракта
    functionName: "getBetDetails", // Функция для получения данных ставки
    args: [betId], // Идентификатор ставки
  });

  const [betAmount, setBetAmount] = useState(0); // Состояние для хранения суммы ставки

  if (!data) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор

  const [description, amount, isActive, creator] = data; // Получаем описание, сумму, статус и создателя ставки

  const handleBet = async () => {
    try {
      await writeContractAsync({
        functionName: "placeBet", // Функция для размещения ставки
        args: [betId], // Идентификатор ставки
        value: betAmount.toString(), // Сумма ставки в wei, преобразуем в строку
      });
      // Увеличиваем сумму пари на сумму ставки
      setBetAmount((prev) => prev + Number(amount));
    } catch (error) {
      console.error("Ошибка при размещении ставки:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-semibold text-black">Ставка: {description}</h3>
      <p className="text-black">Сумма: {amount.toString()} wei</p>
      <p className="text-black">Статус: {isActive ? "Активна" : "Завершена"}</p>
      <p className="text-black">Создатель: {creator}</p>
      {isActive ? ( null
      ) : (
        <p className="text-red-500">Ставка завершена</p>
      )}
      {/* Показываем сообщение, если ставка завершена */}
      {isActive && <EndBet betId={betId} />}
      {/* Отображаем кнопку для завершения ставки, если она активна */}
      <HasUserBet betId={betId} />
      {/* Статус ставки пользователя */}
    </div>
  );
}