import Wallet from "../components/Intex/Wallet";

test("convert ETH to INTX", async () => {
  const web3 = {};
  const intex = {
    ethExchangeRate: async function (_) {
      return 2;
    },
  };
  const address = 0x0;

  const wallet = new Wallet(web3, intex, address);

  const converted = await wallet.convert(3);

  expect(converted).toEqual(6);
});
