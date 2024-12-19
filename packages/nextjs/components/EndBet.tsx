import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function EndBet({ betId }: { betId: bigint }) {
  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract("BettingContract"); // Передаем имя контракта как строку

  // Функция для завершения ставки
  const handleEndBet = async () => {
    try {
      // Выполняем транзакцию на завершение ставки
      await writeContractAsync({
        functionName: "endBet", // Имя функции контракта для завершения ставки
        args: [betId], // Аргумент: идентификатор ставки
      });
      alert("Ставка завершена!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при завершении ставки.");
    }
  };

  return (
    <div className="p-4 bg-red-500 text-white rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-bold">Завершить ставку</h3>
      <p>Вы уверены, что хотите завершить ставку с ID: {betId.toString()}?</p>
      <button
        onClick={handleEndBet} // Завершаем ставку при клике
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`mt-4 px-6 py-2 rounded-lg ${isMining ? "bg-gray-500" : "bg-red-700 hover:bg-red-800"}`}
      >
        {isMining ? "Завершение..." : "Завершить ставку"}
      </button>
    </div>
  );
}