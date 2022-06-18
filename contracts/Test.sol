//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./MutableProxyDeployer.sol";
import './ERC20_P.sol';

contract Test is MutableProxyDeployer{
    function test() external {
        uint256[15] memory codeController;
        address addrController;
        assembly{
            mstore(codeController,0x6101D2600081600B8239F3346101B4573660135733546000526014600CF35B36)
            mstore(add(codeController,32),0x60401460655760003560E01C8063fa54416114609257806315ac72ca1460B657)
            mstore(add(codeController,64),0x8063299a7bcc1460C35780638f8fbab414610118577146554e4354494f4e204e)
            mstore(add(codeController,96),0x4f542045584953546000526012600EFD5B3354608D5760203533556000353374)
            mstore(add(codeController,128),0x0100000000000000000000000000000000000000001755005B600080FD5B6004)
            mstore(add(codeController,160),0x3574010000000000000000000000000000000000000000175460005260206000)
            mstore(add(codeController,192),0xF35B6004355460005260206000F35B6004357401000000000000000000000000)
            mstore(add(codeController,224),0x00000000000000001780543314156101975760243590556024356004357Fb532)
            mstore(add(codeController,256),0x073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c6000)
            mstore(add(codeController,288),0x80A3005B60043580156101105774010000000000000000000000000000000000)
            mstore(add(codeController,320),0x000000175433141561019757602435600435556024356004357Fcfbf4028add9)
            mstore(add(codeController,352),0x318bbf716f08c348595afb063b0e9feed1f86d33681a4b3ed4d3600080A3005B)
            mstore(add(codeController,384),0x78444952454354494f4e2043414e204e4f54204245205a45524f600052601960)
            mstore(add(codeController,416),0x07FD5B7243414c4c4552204953204e4f54204f574e459E6000526013600DFD5B)
            mstore(add(codeController,448),0x734e4f542050415941424c452046554e4354494f4e6000526014600CFD000000)
            addrController := create(0,codeController,477)
        }

        require(addrController!=address(0),'ERROR IN CREATION OF CONTROLLER');

        ERC20_P imp = new ERC20_P();

        address pr = deployProxy(addrController, address(this), address(imp));

        ERC20_P(pr).init();
    }
}