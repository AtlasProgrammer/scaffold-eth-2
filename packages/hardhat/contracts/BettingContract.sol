// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Смарт-контракт для ставок
 * @dev Позволяет создавать ставки, размещать ставки, завершать ставки и проверять, сделал ли пользователь ставку
 */
contract BettingContract {
    string public greeting = "Welcome to the Betting Platform!";

    // Структура, описывающая ставку
    struct Bet {
        string description; // Описание ставки
        uint amount; // Сумма ставки
        mapping(address => bool) hasBet; // Отслеживание пользователей, сделавших ставку
        address creator; // Создатель ставки
        bool isActive; // Статус активности ставки
    }

    // Список всех созданных ставок
    Bet[] public bets;

    /**
     * @dev Создает новую ставку.
     * @param _description Описание ставки.
     * @param _amount Сумма ставки.
     */
    function createBet(string memory _description, uint _amount) public {
        require(_amount > 0, "Bet amount must be greater than zero");

        Bet storage newBet = bets.push();
        newBet.description = _description;
        newBet.amount = _amount;
        newBet.isActive = true;
        newBet.creator = msg.sender;
    }

    /**
     * @dev Размещает ставку.
     * @param _betId ID ставки.
     */
    function placeBet(uint _betId) public payable {
        require(_betId < bets.length, "Bet with such an ID does not exist");
        Bet storage bet = bets[_betId];

        require(bet.isActive, "Bet is not active");
        require(msg.value == bet.amount, "Incorrect bet amount");
        require(!bet.hasBet[msg.sender], "You have already placed a bet");

        // Устанавливаем, что пользователь сделал ставку
        bet.hasBet[msg.sender] = true;
    }

    /**
     * @dev Увеличивает сумму существующей ставки.
     * @param _betId ID ставки.
     */
    function betUp(uint _betId) public payable {
        require(_betId < bets.length, "Bet with such an ID does not exist");
        Bet storage bet = bets[_betId];

        require(bet.isActive, "Bet is not active");
        require(msg.value > 0, "Must send a positive amount");

        // Увеличиваем сумму ставки
        bet.amount += msg.value;
    }

    /**
     * @dev Завершает ставку и деактивирует её.
     * @param _betId ID ставки.
     */
    function endBet(uint _betId) public {
        require(_betId < bets.length, "Bet with such an ID does not exist");
        Bet storage bet = bets[_betId];

        require(bet.isActive, "The bet has already been completed");
        require(msg.sender == bet.creator, "Only the creator can complete the bet");

        // Деактивируем ставку
        bet.isActive = false;
    }

    /**
     * @dev Возвращает информацию о ставке по её ID.
     * @param _betId ID ставки.
     * @return description Описание ставки.
     * @return amount Сумма ставки.
     * @return isActive Статус активности ставки.
     * @return creator Адрес создателя ставки.
     */
    function getBetDetails(uint _betId) public view returns (
        string memory description,
        uint amount,
        bool isActive,
        address creator
    ) {
        require(_betId < bets.length, "Bet with such an ID does not exist");
        Bet storage bet = bets[_betId];
        return (bet.description, bet.amount, bet.isActive, bet.creator);
    }

    /**
     * @dev Проверяет, сделал ли пользователь ставку в данной ставке.
     * @param _betId ID ставки.
     * @param _user Адрес пользователя.
     * @return True, если пользователь уже сделал ставку, иначе False.
     */
    function hasUserBet(uint _betId, address _user) public view returns (bool) {
        require(_betId < bets.length, "Bet with such an ID does not exist");
        Bet storage bet = bets[_betId];
        return bet.hasBet[_user];
    }

    /**
     * @dev Возвращает общее количество ставок.
     * @return Количество созданных ставок.
     */
    function getBetCount() public view returns (uint) {
        return bets.length;
    }
}