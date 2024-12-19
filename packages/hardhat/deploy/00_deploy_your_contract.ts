import { HardhatRuntimeEnvironment } from "hardhat/types"; // Импорт типов для среды выполнения Hardhat
import { DeployFunction } from "hardhat-deploy/types"; // Импорт типа функции деплоя
import { BettingContract } from "../typechain-types"; // Импорт типов сгенерированного контракта

/**
 * Скрипт для деплоя смарт-контракта BettingContract.
 * Использует Hardhat Runtime Environment для доступа к необходимым функциям и данным.
 *
 * @param hre Объект среды выполнения Hardhat.
 */
const deployBettingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Извлечение имени учетной записи для деплоя
  const { deployer } = await hre.getNamedAccounts();
  // Получение функции для развертывания контрактов
  const { deploy } = hre.deployments;

  // Развертывание контракта BettingContract
  await deploy("BettingContract", {
    from: deployer, // Учетная запись, которая развертывает контракт
    args: [], // Аргументы конструктора контракта (в данном случае отсутствуют)
    log: true, // Включение логирования процесса развертывания
    autoMine: true, // Автоматическое майнинг транзакции на локальной сети
  });

  // Получение экземпляра развернутого контракта
  const bettingContract = await hre.ethers.getContract<BettingContract>("BettingContract", deployer);

  // Проверка успешного развертывания контракта через вызов метода greeting()
  console.log("👋 Initial greeting:", await bettingContract.greeting());
};

// Экспорт функции для использования в командах Hardhat
export default deployBettingContract;

// Присвоение тега для удобного выбора скрипта при выполнении
deployBettingContract.tags = ["BettingContract"];