import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function BetResults() {
  const [betId, setBetId] = useState<number>(-1);

  // Чтение данных о ставке
  const { data } = useScaffoldReadContract({
    contractName: "BettingContract", // Имя контракта
    functionName: "getBetDetails", // Функция для получения данных о ставке
    args: [BigInt(betId)], // Идентификатор ставки
  });

  return (
    <div className="p-6 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-lg mx-auto">
      <h3 className="text-2xl font-bold mb-4">Результаты ставок</h3>
      <input
        type="number"
        placeholder="ID ставки"
        onChange={e => setBetId(e.target.value ? Number(e.target.value) : -1)}
        className="w-full p-2 mb-4 text-black rounded-lg"
      />
      {data && (
        <div className="p-6 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded-lg shadow-lg w-full mx-auto">
          <h4 className="text-xl font-semibold">Детали ставки:</h4>
          <p>Описание: {data[0]}</p> {/* Описание ставки */}
          <p>Сумма: {data[1].toString()} wei</p> {/* Сумма ставки */}
          <p>Статус: {data[2] ? "Активна" : "Завершена"}</p> {/* Статус ставки */}
          <p>Создатель: {data[3]}</p> {/* Адрес создателя ставки */}
        </div>
      )}
      {betId === -1 && <p className="text-red-500">Пожалуйста, введите корректный ID ставки.</p>}
    </div>
  );
}