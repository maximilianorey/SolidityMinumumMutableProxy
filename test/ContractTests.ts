/* eslint-disable sonarjs/no-duplicate-string */
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import { ProxyController__factory } from "../src/ControllerContract/ProxyController__factory";
import { ERC20P__factory, ERC20P2__factory } from "../src/typechain";

describe("MutableProxy", function () {
  it("Should deploy a proxy with controller1 and call to transparent functions of proxy, and later change implementation", async function () {
    const [wallet] = await ethers.getSigners();

    const controllerFactory = new ProxyController__factory(wallet);
    const controller = await controllerFactory.deploy();

    const mutableProxyDeployer = await (
      await ethers.getContractFactory("MutableProxyDeployer")
    ).deploy();

    const erc20_1 = await (await ethers.getContractFactory("ERC20_P")).deploy();

    const tx = await (
      await mutableProxyDeployer.deployProxy(
        controller.address,
        wallet.address,
        erc20_1.address
      )
    ).wait();

    const proxyAddr = tx.events![0].args![0];

    const erc20P = ERC20P__factory.connect(proxyAddr, wallet);
    await (await erc20P.init()).wait();

    expect((await erc20P.balanceOf(wallet.address)).isZero()).to.be.equal(true);
    await (await erc20P.mint(wallet.address, "1000000000000000000")).wait();
    expect((await erc20P.balanceOf(wallet.address)).toString()).to.be.equal(
      "1000000000000000000"
    );

    await (
      await erc20P.transfer(
        "0x0000000000000000000000000000000000000001",
        "500000000000000000"
      )
    ).wait();

    expect((await erc20P.balanceOf(wallet.address)).toString()).to.be.equal(
      "500000000000000000"
    );

    expect(
      (
        await erc20P.balanceOf("0x0000000000000000000000000000000000000001")
      ).toString()
    ).to.be.equal("500000000000000000");

    expect(await erc20P.name()).to.be.equal("HELLO");

    const erc20_2 = new ERC20P2__factory(wallet);
    const erc20_2_instance = await erc20_2.deploy();

    await expect(
      controller.setImplementation(
        erc20P.address,
        "0x0000000000000000000000000000000000000000"
      )
    ).to.be.revertedWith("IMPLEMENTATION CAN NOT BE ZERO");

    const txSI = await (
      await controller.setImplementation(
        erc20P.address,
        erc20_2_instance.address
      )
    ).wait();

    expect(txSI.events![0].event!).to.be.equal("ImplementationChanged");
    expect(txSI.events![0].args![0]).to.be.equal(erc20P.address);
    expect(txSI.events![0].args![1]).to.be.equal(erc20_2_instance.address);

    expect(await erc20P.name()).to.be.equal("ANOTHER NAME");

    expect((await erc20P.balanceOf(wallet.address)).toString()).to.be.equal(
      "500000000000000000"
    );

    expect(
      (
        await erc20P.balanceOf("0x0000000000000000000000000000000000000001")
      ).toString()
    ).to.be.equal("500000000000000000");

    const invalidContract = new Contract(
      controller.address,
      [
        {
          inputs: [
            {
              internalType: "address",
              name: "addr",
              type: "address",
            },
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "invalidF",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      wallet
    );

    await expect(
      invalidContract.invalidF(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).to.be.revertedWith("FUNCTION NOT EXISTS");

    const payableContract = new Contract(
      controller.address,
      [
        {
          inputs: [
            {
              internalType: "address",
              name: "addr",
              type: "address",
            },
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "setOwner",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      wallet
    );

    await expect(
      payableContract.setOwner(
        erc20P.address,
        "0x0000000000000000000000000000000000000001",
        { value: "20" }
      )
    ).to.be.revertedWith("NOT PAYABLE FUNCTION");

    const txCO = await (
      await controller.setOwner(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).wait();

    expect(txCO.events![0].event!).to.be.equal("OwnerChanged");
    expect(txCO.events![0].args![0]).to.be.equal(erc20P.address);
    expect(txCO.events![0].args![1]).to.be.equal(
      "0x0000000000000000000000000000000000000001"
    );

    await expect(
      controller.setOwner(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).to.be.revertedWith("CALLER IS NOT THE OWNER");

    await expect(
      controller.setImplementation(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).to.be.revertedWith("CALLER IS NOT THE OWNER");
  });

  it("Should deploy a proxy with controller2A and call to transparent functions of proxy, and later change implementation", async function () {
    const [wallet] = await ethers.getSigners();

    const controller = await (
      await ethers.getContractFactory("ProxyController2")
    ).deploy();

    const mutableProxyDeployer = await (
      await ethers.getContractFactory("MutableProxyDeployer")
    ).deploy();

    const erc20_1 = await (await ethers.getContractFactory("ERC20_P")).deploy();

    const tx = await (
      await mutableProxyDeployer.deployProxy(
        await controller.getControllerB(),
        wallet.address,
        erc20_1.address
      )
    ).wait();

    const proxyAddr = tx.events![0].args![0];

    const erc20P = ERC20P__factory.connect(proxyAddr, wallet);
    await (await erc20P.init()).wait();

    expect((await erc20P.balanceOf(wallet.address)).isZero()).to.be.equal(true);
    await (await erc20P.mint(wallet.address, "1000000000000000000")).wait();
    expect((await erc20P.balanceOf(wallet.address)).toString()).to.be.equal(
      "1000000000000000000"
    );

    await (
      await erc20P.transfer(
        "0x0000000000000000000000000000000000000001",
        "500000000000000000"
      )
    ).wait();

    expect((await erc20P.balanceOf(wallet.address)).toString()).to.be.equal(
      "500000000000000000"
    );

    expect(
      (
        await erc20P.balanceOf("0x0000000000000000000000000000000000000001")
      ).toString()
    ).to.be.equal("500000000000000000");

    expect(await erc20P.name()).to.be.equal("HELLO");

    const erc20_2 = new ERC20P2__factory(wallet);
    const erc20_2_instance = await erc20_2.deploy();

    const txSI = await (
      await controller.setImplementation(
        erc20P.address,
        erc20_2_instance.address
      )
    ).wait();

    expect(txSI.events![0].event!).to.be.equal("ImplementationChanged");
    expect(txSI.events![0].args![0]).to.be.equal(erc20P.address);
    expect(txSI.events![0].args![1]).to.be.equal(erc20_2_instance.address);

    expect(await erc20P.name()).to.be.equal("ANOTHER NAME");

    expect((await erc20P.balanceOf(wallet.address)).toString()).to.be.equal(
      "500000000000000000"
    );

    expect(
      (
        await erc20P.balanceOf("0x0000000000000000000000000000000000000001")
      ).toString()
    ).to.be.equal("500000000000000000");

    const txCO = await (
      await controller.setOwner(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).wait();

    expect(txCO.events![0].event!).to.be.equal("OwnerChanged");
    expect(txCO.events![0].args![0]).to.be.equal(erc20P.address);
    expect(txCO.events![0].args![1]).to.be.equal(
      "0x0000000000000000000000000000000000000001"
    );

    await expect(
      controller.setOwner(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).to.be.revertedWith("CALLER IS NOT THE OWNER");

    await expect(
      controller.setImplementation(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).to.be.revertedWith("CALLER IS NOT THE OWNER");
  });

  it("Should deploy a proxy with controller2B and call to transparent functions of proxy, and later change implementation", async function () {
    const [wallet] = await ethers.getSigners();

    const controller = await (
      await ethers.getContractFactory("ProxyController2B")
    ).deploy();

    const mutableProxyDeployer = await (
      await ethers.getContractFactory("MutableProxyDeployer")
    ).deploy();

    const erc20_1 = await (await ethers.getContractFactory("ERC20_P")).deploy();

    const tx = await (
      await mutableProxyDeployer.deployProxy(
        await controller.getControllerB(),
        wallet.address,
        erc20_1.address
      )
    ).wait();

    const proxyAddr = tx.events![0].args![0];

    const erc20P = ERC20P__factory.connect(proxyAddr, wallet);
    await (await erc20P.init()).wait();

    expect((await erc20P.balanceOf(wallet.address)).isZero()).to.be.equal(true);
    await (await erc20P.mint(wallet.address, "1000000000000000000")).wait();
    expect((await erc20P.balanceOf(wallet.address)).toString()).to.be.equal(
      "1000000000000000000"
    );

    await (
      await erc20P.transfer(
        "0x0000000000000000000000000000000000000001",
        "500000000000000000"
      )
    ).wait();

    expect((await erc20P.balanceOf(wallet.address)).toString()).to.be.equal(
      "500000000000000000"
    );

    expect(
      (
        await erc20P.balanceOf("0x0000000000000000000000000000000000000001")
      ).toString()
    ).to.be.equal("500000000000000000");

    expect(await erc20P.name()).to.be.equal("HELLO");

    const erc20_2 = new ERC20P2__factory(wallet);
    const erc20_2_instance = await erc20_2.deploy();

    const txSI = await (
      await controller.setImplementation(
        erc20P.address,
        erc20_2_instance.address
      )
    ).wait();

    expect(txSI.events![0].event!).to.be.equal("ImplementationChanged");
    expect(txSI.events![0].args![0]).to.be.equal(erc20P.address);
    expect(txSI.events![0].args![1]).to.be.equal(erc20_2_instance.address);

    expect(await erc20P.name()).to.be.equal("ANOTHER NAME");

    expect((await erc20P.balanceOf(wallet.address)).toString()).to.be.equal(
      "500000000000000000"
    );

    expect(
      (
        await erc20P.balanceOf("0x0000000000000000000000000000000000000001")
      ).toString()
    ).to.be.equal("500000000000000000");

    const txCO = await (
      await controller.setOwner(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).wait();

    expect(txCO.events![0].event!).to.be.equal("OwnerChanged");
    expect(txCO.events![0].args![0]).to.be.equal(erc20P.address);
    expect(txCO.events![0].args![1]).to.be.equal(
      "0x0000000000000000000000000000000000000001"
    );

    await expect(
      controller.setOwner(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).to.be.revertedWith("CALLER IS NOT THE OWNER");

    await expect(
      controller.setImplementation(
        erc20P.address,
        "0x0000000000000000000000000000000000000001"
      )
    ).to.be.revertedWith("CALLER IS NOT THE OWNER");
  });
});