import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function HasUserBet({ betId }: { betId: bigint }) {
  const { address, isConnected } = useAccount(); // Получаем адрес и статус подключения пользователя
  const [userAddress, setUserAddress] = useState<string>(""); // Исправлено: правильное имя состояния

  // Хук для чтения данных о том, сделал ли пользователь ставку
  const { data: hasBet } = useScaffoldReadContract({
    contractName: "BettingContract", // Имя контракта
    functionName: "hasUserBet", // Функция для проверки, сделал ли пользователь ставку
    args: [betId, userAddress], // Аргументы: идентификатор ставки и адрес пользователя
  });

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address); // Исправлено: правильное имя функции
    }
  }, [isConnected, address]);

  if (hasBet === undefined) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор

  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md mt-4">
      {hasBet ? (
        <p className="text-xl font-semibold">Вы уже сделали ставку на эту игру.</p> // Если пользователь сделал ставку
      ) : (
        <p className="text-xl font-semibold">Вы ещё не сделали ставку на эту игру.</p> // Если пользователь не сделал ставку
      )}
    </div>
  );
}