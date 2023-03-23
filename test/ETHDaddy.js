const { expect } = require("chai")
const {ethers} =  require("hardhat");
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("ETHDaddy", () => {
  let ethDaddy;
  let deployer , owner1;

  const NAME = "Eth daddy";
  const SYMBOL = "ETHD";
  beforeEach(async()=>{

   [deployer, owner1] = await ethers.getSigners();
  //  console.log(signers[0].address);
    const ETHDaddy = await ethers.getContractFactory("ETHDaddy");
     ethDaddy =await ETHDaddy.deploy("Eth daddy", "ETHD");

     // list a domain

     const transaction = await ethDaddy.connect(deployer).list("jack.eth", tokens(10));
     // here in the above statement if we had used owner1 the returns the max supplly probably would have failed
     await transaction.wait();

  })
  describe("deployment and constructer", ()=>{
    it("has a name",async ()=>{
   
      const result =await  ethDaddy.name();
      expect(result).to.equal(NAME);
   
     })
     it("has a ssymbol",async ()=>{
      const symbol = await ethDaddy.symbol();
      expect(symbol).to.equal(SYMBOL);
   
     })

     it('sets the owner',async ()=>{
      const result = await ethDaddy.owner();
      expect(result).to.equal(deployer.address);
     })
     it('returns the max supply', async()=>{
      const result = await ethDaddy.maxSupply();
      expect(result).to.equal(1);
     })
     it("returns the total supply", async()=>{
      const result = await ethDaddy.totalSupply();
      expect(result).to.be.equal(0);
     })

  })

  describe("domain", ()=>{
    it("returns doman attributes", async()=>{
      let  domain = await ethDaddy.getDomain(1);
      expect(domain.name).to.equal("jack.eth");
      expect(domain.cost).to.equal(tokens(10));
      expect(domain.isOwned).to.equal(false);


    })
  })

  describe("minting", ()=>{
    const ID=1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether");

    beforeEach(async()=>{
      const transaction = await ethDaddy.connect(owner1).mint(ID, {value : AMOUNT});
      await transaction.wait();
    })
    it("updates the owner", async()=>{
      const owner = await ethDaddy.ownerOf(ID);
      expect(owner).to.be.equal(owner1.address);
      


    })

    it("updates the domain status", async()=>{
      const domain = await ethDaddy.getDomain(ID);
      expect(domain.isOwned).to.be.equal(true);
    })
    it("updates the contract balance", async()=>{
      const result = await ethDaddy.getBalance();
      expect(result).to.be.equal(AMOUNT);
    })
    it("updates the totalSupply", async()=>{
      const result = await ethDaddy.totalSupply();
      expect(result).to.be.equal(1);

    })
  })

  describe("Withdrawing", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await ethDaddy.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()

      transaction = await ethDaddy.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethDaddy.getBalance()
      expect(result).to.equal(0)
    })
  })

})
