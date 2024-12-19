import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreateBet() {
  // Состояния для хранения данных о ставке
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>(""); // Описание ставки

  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract("BettingContract"); // Передаем строку напрямую

  // Функция для создания ставки
  const createBet = async () => {
    if (amount > 0 && description) {
      try {
        // Выполняем транзакцию на создание ставки
        await writeContractAsync({
          functionName: "createBet", // Имя функции контракта для создания ставки
          args: [description, BigInt(amount)], // Аргументы: описание ставки и сумма ставки
        });
        alert("Ставка успешно создана!");
      } catch (error) {
        console.error(error);
        alert("Ошибка при создании ставки: " + error.message);
      }
    } else {
      alert("Пожалуйста, введите корректную сумму ставки и описание."); // Если сумма или описание не корректны
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Создать ставку</h2>
      <input
        type="text"
        placeholder="Описание ставки"
        value={description}
        onChange={e => setDescription(e.target.value)} // Обновляем состояние описания ставки
        className="w-full p-2 mb-4 text-black rounded-lg"
      />
      <input
        type="number"
        placeholder="Сумма ставки (в wei)"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))} // Обновляем состояние суммы ставки
        className="w-full p-2 mb-4 text-black rounded-lg"
      />
      <button
        onClick={createBet} // Запуск создания ставки
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`w-full py-2 rounded-lg text-white ${isMining ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {isMining ? "Создание..." : "Создать ставку"} {/*Текст на кнопке зависит от состояния загрузки*/}
      </button>
    </div>
  );
}