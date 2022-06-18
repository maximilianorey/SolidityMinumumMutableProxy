import { ethers, Wallet } from "ethers";

import { ProxyController__factory } from "./ControllerContract/ProxyController__factory";
import {
  ERC20P__factory,
  ERC20P2__factory,
  MutableProxyDeployer__factory,
} from "./typechain";

const provider = new ethers.providers.JsonRpcProvider({
  url: "http://localhost:8545",
});

const wallet = Wallet.fromMnemonic(
  "recycle excess begin share mystery source bright phone champion walk among group"
).connect(provider);

async function run() {
  const controller = new ProxyController__factory(wallet);
  const controllerInstance = await controller.deploy();

  const erc20 = new ERC20P__factory(wallet);
  const erc20Instance = await erc20.deploy();

  const proxyDeployer = new MutableProxyDeployer__factory(wallet);
  const proxyDeployerInstance = await proxyDeployer.deploy();

  const trDeploy = await (
    await proxyDeployerInstance.deployProxy(
      controllerInstance.address,
      wallet.address,
      erc20Instance.address
    )
  ).wait();

  const erc20PAddr = trDeploy.events![0].args![0];

  const erc20P = ERC20P__factory.connect(erc20PAddr, wallet);
  await (await erc20P.init()).wait();

  console.log((await erc20P.balanceOf(wallet.address)).isZero());
  await (await erc20P.mint(wallet.address, "1000000000000000000")).wait();
  console.log(
    (await erc20P.balanceOf(wallet.address)).toString() ===
      "1000000000000000000"
  );
  await (
    await erc20P.transfer(
      "0x0000000000000000000000000000000000000001",
      "500000000000000000"
    )
  ).wait();

  console.log(
    (await erc20P.balanceOf(wallet.address)).toString() === "500000000000000000"
  );

  console.log(
    (
      await erc20P.balanceOf("0x0000000000000000000000000000000000000001")
    ).toString() === "500000000000000000"
  );

  console.log((await erc20P.name()) === "HELLO");

  const erc20_2 = new ERC20P2__factory(wallet);
  const erc20_2_instance = await erc20_2.deploy();

  const txSI = await (
    await controllerInstance.setImplementation(
      erc20P.address,
      erc20_2_instance.address
    )
  ).wait();

  console.log(JSON.stringify(txSI.events, undefined, 2));

  console.log((await erc20P.name()) === "ANOTHER NAME");

  console.log(
    (await erc20P.balanceOf(wallet.address)).toString() === "500000000000000000"
  );

  console.log(
    (
      await erc20P.balanceOf("0x0000000000000000000000000000000000000001")
    ).toString() === "500000000000000000"
  );
}

run().catch((err) => console.error(err));
