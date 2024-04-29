import { readFileSync } from "fs";
import { ethers } from "ethers";

const MASTER_PRIVATE_KEY = "";

const EXPLORER_URL = "";
const RPC = "";

const MIN_AMOUNT = 0.001;
const MAX_AMOUNT = 0.002;
const AMOUNT_DECIMALS = 6;

const MIN_GWEI = 0.0001;
const MAX_GWEI = 0.00012;
const GWEI_DECIMALS = 6;

const MIN_SLEEP_SEC = 2;
const MAX_SLEEP_SEC = 5;

const FILE_ADDRESSES = "input/addresses.txt";

const randomFloat = (min, max, decimals) => {
  const rnd = Math.random() * (max - min) + min;
  const multiplier = Math.pow(10, decimals);
  return Math.round(rnd * multiplier) / multiplier;
};

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const main = async () => {
  const addresses = readFileSync(FILE_ADDRESSES, { encoding: "utf-8" })
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const provider = new ethers.JsonRpcProvider(RPC);

  let idx = 1;

  for (const to of addresses) {
    const amount = randomFloat(MIN_AMOUNT, MAX_AMOUNT, AMOUNT_DECIMALS);
    const value = ethers.parseEther(String(amount));

    const gasGwei = randomFloat(MIN_GWEI, MAX_GWEI, GWEI_DECIMALS).toString();
    const gasPrice = ethers.parseUnits(gasGwei, "gwei").toString();

    const account = new ethers.Wallet(MASTER_PRIVATE_KEY, provider);

    const tx = await account.sendTransaction({ to, value, gasPrice });

    await tx.wait();

    const sleepSec = randomInt(MIN_SLEEP_SEC, MAX_SLEEP_SEC);

    const msg = [idx, to, amount, `${EXPLORER_URL}/${tx.hash}`, `${sleepSec}s`];

    console.log(msg.join(" | "));

    idx += 1;

    await new Promise((resolve) => setTimeout(resolve, sleepSec * 1000));
  }
};

main();
