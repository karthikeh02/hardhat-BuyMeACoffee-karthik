const hre = require("hardhat");

async function main() {
  const BuyMeACoffee = await hre.ethers.deployContract("BuyMeACoffee");
  await BuyMeACoffee.waitForDeployment();

  console.log(`Contract deployed to ${await BuyMeACoffee.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x4Df203A66313C1B5c5501008c0eAD8e9ab2Da28C
