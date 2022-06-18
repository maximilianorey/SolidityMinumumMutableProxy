//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import './ProxyController2B.sol';

contract TestProxyController2B{
    function test() external{       
        ProxyController2B controller = new ProxyController2B();
        address controllerB = controller.getControllerB();

        address[1] memory res;
        uint256 ok;
        uint256[2] memory parameters;
        address addrThis = address(this);
        
        assembly{
            mstore(parameters,addrThis)
            mstore(add(parameters,32),0x0000000000000000000000000000000000000000000000000000000000000002)
            ok := call(gas(),controllerB,0,parameters,64,0,0)
        }
        require(ok!=0,'FAILS FUNCTION');
        require(controller.getImplementation(addrThis)==address(2),'ERROR GET IMP');
        require(controller.getOwner(addrThis)==address(addrThis),'ERROR GET IMP');

        assembly{
            ok := call(gas(),controllerB,0,0,0,add(res,0x0C),20)
        }
        require(res[0]==address(2),'ERROR GET SELF IMPLEMENTATION');

        controller.setImplementation(addrThis, address(3));
        require(controller.getImplementation(addrThis)==address(3),'ERROR SET IMP');
        controller.setOwner(addrThis, address(1));
        require(controller.getOwner(addrThis)==address(1),'ERROR GET IMP');
    }
}