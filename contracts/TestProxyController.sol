//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import './DummyProxyController.sol';

//0x61027C600081600B8239F33461017F573660135733546000526014600CF35B3660401460565760003560E01C8063fa54416114608357806315ac72ca1460A7578063299a7bcc1460B45780638f8fbab414610109576038806102016000396000FD5B3354607E57602035335560003533740100000000000000000000000000000000000000001755005B600080FD5B60043574010000000000000000000000000000000000000000175460005260206000F35B6004355460005260206000F35B600435740100000000000000000000000000000000000000001780543314156101725760243590556024356004357Fb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c600080A3005B60243580156101655760043574010000000000000000000000000000000000000000175433141561017257600435556024356004357Fcfbf4028add9318bbf716f08c348595afb063b0e9feed1f86d33681a4b3ed4d3600080A3005B603C806101B16000396000FD5B603C8061018C6000396000FD5B6039806101C86000396000FD08c379a000000000000000000000000000000000000000000000000000000000000000011743414c4c4552204953204e4f5420544845204f574e455208c379a00000000000000000000000000000000000000000000000000000000000000001144e4f542050415941424c452046554e4354494f4e08c379a000000000000000000000000000000000000000000000000000000000000000011346554e4354494f4e204e4f542045584953545308c379a000000000000000000000000000000000000000000000000000000000000000011E494d504c454d454e544154494f4e2043414e204e4f54204245205a45524f

contract TestProxyController{
    function test() external{        
        uint256[21] memory code;
        address addr;
        address[1] memory res;
        uint256 ok;
        uint256[2] memory parameters;
        address addrThis = address(this);
        assembly{
            mstore(code,0x61027C600081600B8239F33461017F573660135733546000526014600CF35B36)
            mstore(add(code,32),0x60401460565760003560E01C8063fa54416114608357806315ac72ca1460A757)
            mstore(add(code,64),0x8063299a7bcc1460B45780638f8fbab414610109576038806102016000396000)
            mstore(add(code,96),0xFD5B3354607E5760203533556000353374010000000000000000000000000000)
            mstore(add(code,128),0x0000000000001755005B600080FD5B6004357401000000000000000000000000)
            mstore(add(code,160),0x0000000000000000175460005260206000F35B6004355460005260206000F35B)
            mstore(add(code,192),0x6004357401000000000000000000000000000000000000000017805433141561)
            mstore(add(code,224),0x01725760243590556024356004357Fb532073b38c83145e3e5135377a08bf9aa)
            mstore(add(code,256),0xb55bc0fd7c1179cd4fb995d2a5159c600080A3005B6024358015610165576004)
            mstore(add(code,288),0x3574010000000000000000000000000000000000000000175433141561017257)
            mstore(add(code,320),0x600435556024356004357Fcfbf4028add9318bbf716f08c348595afb063b0e9f)
            mstore(add(code,352),0xeed1f86d33681a4b3ed4d3600080A3005B603C806101B16000396000FD5B603C)
            mstore(add(code,384),0x8061018C6000396000FD5B6039806101C86000396000FD08c379a00000000000)
            mstore(add(code,416),0x0000000000000000000000000000000000000000000000000000011743414c4c)
            mstore(add(code,448),0x4552204953204e4f5420544845204f574e455208c379a0000000000000000000)
            mstore(add(code,480),0x0000000000000000000000000000000000000000000001144e4f542050415941)
            mstore(add(code,512),0x424c452046554e4354494f4e08c379a000000000000000000000000000000000)
            mstore(add(code,544),0x000000000000000000000000000000011346554e4354494f4e204e4f54204558)
            mstore(add(code,576),0x4953545308c379a0000000000000000000000000000000000000000000000000)
            mstore(add(code,608),0x00000000000000011E494d504c454d454e544154494f4e2043414e204e4f5420)
            mstore(add(code,640),0x4245205a45524f00000000000000000000000000000000000000000000000000)
            addr := create(0,code,647)
        }
        require(DummyProxyController(addr).getImplementation(addrThis)==address(0),'ERROR GET IMP');
        require(DummyProxyController(addr).getOwner(addrThis)==address(0),'ERROR GET IMP');
        assembly{
            ok := call(gas(),addr,0,0,0,add(res,0x0C),20)
        }
        require(ok!=0,'FAILS FUNCTION');
        require(res[0]==address(0),'ERROR GET SELF IMPLEMENTATION');
        assembly{
            mstore(parameters,addrThis)
            mstore(add(parameters,32),0x0000000000000000000000000000000000000000000000000000000000000002)
            ok := call(gas(),addr,0,parameters,64,0,0)
        }
        require(ok!=0,'FAILS FUNCTION');
        require(DummyProxyController(addr).getImplementation(addrThis)==address(2),'ERROR GET IMP');
        require(DummyProxyController(addr).getOwner(addrThis)==address(addrThis),'ERROR GET IMP');

        assembly{
            ok := call(gas(),addr,0,0,0,add(res,0x0C),20)
        }
        require(res[0]==address(2),'ERROR GET SELF IMPLEMENTATION');

        DummyProxyController(addr).setImplementation(addrThis, address(0)); // SHOULD FAIL

        DummyProxyController(addr).setImplementation(addrThis, address(3));
        require(DummyProxyController(addr).getImplementation(addrThis)==address(3),'ERROR SET IMP');
        DummyProxyController(addr).setOwner(addrThis, address(1));
        require(DummyProxyController(addr).getOwner(addrThis)==address(1),'ERROR GET IMP');

        DummyProxyController(addr).setOwner(addrThis,address(2)); // SHOULD FAIL
    }
}