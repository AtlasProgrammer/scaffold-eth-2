"use client";

import { useEffect, useState } from "react";
import CreateBet from "../components/CreateBet";
import BetList from "../components/BetList";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import BetResults from "../components/BetResults"; // Компонент для отображения результатов ставок
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth"; // Импортируем хук для чтения контракта

const Page: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [activeBets, setActiveBets] = useState<bigint[]>([]); // Состояние для хранения активных ставок

  // Хук для чтения активных ставок
  const { data: activeBetsData } = useScaffoldReadContract({
    contractName: "BettingContract", // Имя контракта
    functionName: "getActiveBets", // Имя функции для получения активных ставок
  });

  useEffect(() => {
    if (isConnected) {
      console.log("Пользователь подключен: ", address);
      // Здесь можно добавить логику для получения активных ставок из контракта
      fetchActiveBets();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (activeBetsData) {
      setActiveBets(activeBetsData); // Обновляем состояние активных ставок
    }
  }, [activeBetsData]);

  const fetchActiveBets = async () => {
    // Здесь можно добавить дополнительную логику, если необходимо
    // Например, если функция getActiveBets требует аргументов
  };

  return (
    <div>
      <h1>Ставки</h1>
      <CreateBet />
      <BetList activeBets={activeBets} /> {/* Передаем активные ставки в BetList */}
      <BetResults />
    </div>
  );
};

export default Page;