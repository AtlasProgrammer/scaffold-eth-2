import { expect } from "chai";
import { ethers } from "hardhat";
import { BettingContract } from "../typechain-types"; // Убедитесь, что путь правильный

describe("BettingContract", function () {
  let betting: BettingContract;
  let owner: any;
  let addr1: any;
  let addr2: any;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const bettingFactory = await ethers.getContractFactory("BettingContract");
    betting = (await bettingFactory.deploy()) as BettingContract; // Убедитесь, что здесь нет вызова .deployed()
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await betting.owner()).to.equal(owner.address);
    });

    it("Should not allow betting before event ends", async function () {
      await expect(betting.placeBet(0, { value: ethers.parseEther("1") })).to.be.revertedWith("Bet with such an ID does not exist");
    });
  });

  describe("Betting", function () {
    it("Should allow users to place bets", async function () {
      await betting.createBet("Bet 1", ethers.parseEther("1"));
      await betting.createBet("Bet 2", ethers.parseEther("2"));

      await betting.placeBet(0, { value: ethers.parseEther("1") });
      await betting.placeBet(1, { value: ethers.parseEther("2") });

      const betsCount = await betting.getBetCount();
      expect(betsCount).to.equal(2);
    });

    it("Should allow the owner to end the event", async function () {
      await betting.endBet(0);
      const betDetails = await betting.getBetDetails(0);
      expect(betDetails[2]).to.be.false; // isActive
    });

    it("Should not allow claiming winnings before event ends", async function () {
      await expect(betting.claimWinnings(0)).to.be.revertedWith("Event has not ended yet");
    });
  });
});