//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
CONSTRUCTOR:
    PUSH1 0x98
    PUSH1 0x0
    DUP2
    PUSH1 0xa
    DUP3
    CODECOPY
    RETURN

    0x60
    0x95 //PUSH 149 (CODE LENGTH)
    0x60
    0x00 // PUSH 0
    0x81 // DUP2 (CODE LENGTH)
    0x60
    0x0A // PUSH 10
    0x82 // DUP3 (0)
    0x39 // CODECOPY
    0xF3 // RETURN
CONTROLLER:
    CALLDATASIZE
    PUSH1 0x12
    JUMPI
    CALLVALUE
    PUSH1 0x58
    JUMPI
    CALLER
    SLOAD
    PUSH1 0x0
    MSTORE
    PUSH1 0x14
    PUSH1 0xc
    RETURN
    JUMPDEST
    CALLER
    PUSH20 0x-- // DIRECTION OF PROXY CONTROLLER A
    EQ
    PUSH1 0x76
    JUMPI
    CALLVALUE
    PUSH1 0x58
    JUMPI
    CALLER
    SLOAD
    PUSH1 0x93
    JUMPI
    PUSH1 0x20
    CALLDATALOAD
    CALLER
    SSTORE
    PUSH1 0x0
    CALLDATALOAD
    CALLER
    PUSH21 0x10000000000000000000000000000000000000000
    OR
    SSTORE
    STOP
    JUMPDEST
    PUSH20 0x4e4f542050415941424c452046554e4354494f4e
    PUSH1 0x0
    MSTORE
    PUSH1 0x14
    PUSH1 0xc
    REVERT
    JUMPDEST
    CALLDATASIZE
    PUSH1 0x40
    EQ
    PUSH1 0x8a
    JUMPI
    PUSH1 0x0
    CALLDATALOAD
    SLOAD
    PUSH1 0x0
    MSTORE
    PUSH1 0x14
    PUSH1 0xc
    RETURN
    JUMPDEST
    PUSH1 0x20
    CALLDATALOAD
    PUSH1 0x0
    CALLDATALOAD
    SSTORE
    STOP
    JUMPDEST
    PUSH1 0x0
    DUP1
    REVERT

    0x36 //CALLDATASIZE
    0x60
    0x12 // DIRECTION OF JUMPI 1
    0x57 //JUMPI
    0x34 // calValue
    0x60
    0x58 // PUSH DEST JUMPI NOT PAYABLE FUNCTION
    0x57 // JUMPI
    0x33 // MSG.CALLER
    0x54 // SLOAD (GET IMPL)
    0x60
    0x00 // PUSH 0
    0x52 // MSTORE
    0x60
    0x14 //PUSH 20
    0x60
    0x0C // PUSH 12
    0xF3 // RETURN
    0x5B // DEST JUMPI 1
    0x33 // CALLER
    0x73 // THE FOLLOWING ZEROS WILL BE REMPLAZED BY PROXY CONTROLLER A DIRECTION
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x14 //EQ
    0x60
    0x76 // DIRECTION OF JUMPI 2
    0x57 //JUMPI
    0x34 // callValue
    0x60
    0x58 // PUSH DEST JUMPI NOT PAYABLE FUNCTION
    0x57 // JUMPI
    0x33 // msg.caller
    0x54 //SLOAD
    0x60
    0x90 // DIRECTION OF JUMPI 3
    0x57 //JUMPI
    0x60
    0x20 // PUSH 32
    0x35 // CALLDATALOAD (address imp)
    0x33 //msg.caller
    0x55 // SSTORE (store address imp)
    0x60
    0x00 // PUSH 0
    0x35 // CALLDATALOAD (address owner)
    0x33 //msg.caller
    0x74
    0x01
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x00
    0x17 //OR
    0x55 // SSTORE (store address owner)
    0x00 //STOP
    0x5B // DEST NOT PAYABLE FUNCTION
    0x73
    0x4e
    0x4f
    0x54
    0x20
    0x50
    0x41
    0x59
    0x41
    0x42
    0x4c
    0x45
    0x20
    0x46
    0x55
    0x4e
    0x43
    0x54
    0x49
    0x4f
    0x4e // PUSH NOT PAYABLE FUNCTION
    0x60
    0x00 // PUSH 0
    0x52 // MSTORE
    0x60
    0x14 // PUSH 20
    0x60
    0x0C // PUSH 12
    0xFD // REVERSE
    0x5B //DEST JUMPI 2
    0x60
    0x00 // PUSH 0
    0x35 // CALLDATALOAD
    0x36 // CALLDATASIZE
    0x60
    0x40 // PUSH 64
    0x14 //EQ
    0x60
    0x8A // DIRECTION JUMPI SSTORE
    0x57 // JUMPI
    0x54 // SLOAD
    0x60
    0x00 // PUSH 0
    0x52 // MSTORE
    0x60
    0x14 // PUSH 20
    0x60
    0x0C // PUSH 12
    0xF3 // RETURN
    0x5B //DEST JUMPI SSTORE
    0x60
    0x20 // PUSH 20
    0x35 // CALLDATALOAD
    0x55 // SSTORE
    0x00 // STOP
    0x5B //DEST JUMPI 3
    0x60
    0x00 // PUSH 0
    0x80 // DUP1 (0)
    0xFD // REVERSE

    0x6095600081600A8239F3366012573460585733546000526014600CF35B3373000000000000000000000000000000000000000014607657346058573354609057602035335560003533740100000000000000000000000000000000000000001755005B734e4f542050415941424c452046554e4354494f4e6000526014600CFD5B60003536604014608A57546000526014600CF35B60203555005B600080FD
*/

contract ProxyController2B{
    address proxyControllerB;
    constructor(){
        uint256[6] memory code;
        address addrThis = address(this);
        address _proxyControllerB;
        assembly{
            mstore(code,0x6095600081600A8239F3366012573460585733546000526014600CF35B337300)
            mstore(add(code,31),or(0x0000000000000000000000000000000000000000146076573460585733546090,shl(96,addrThis)))
            mstore(add(code,63),0x5760203533556000353374010000000000000000000000000000000000000000)
            mstore(add(code,95),0x1755005B734e4f542050415941424c452046554e4354494f4e6000526014600C)
            mstore(add(code,127),0xFD5B60003536604014608A57546000526014600CF35B60203555005B600080FD)
            _proxyControllerB := create(0,code,159)
        }
        proxyControllerB = _proxyControllerB;
    }

    event OwnerChanged(address indexed contr, address indexed newOwner);
    event ImplementationChanged(address indexed contr, address indexed newImp);

    function getControllerB() public view returns(address){
        return proxyControllerB;
    }

    function getImplementation(address addr) public view returns(address){
        address[2] memory imp;
        address _proxyControllerB = proxyControllerB;
        assembly{
            mstore(imp,addr)
            let r := staticcall(gas(),_proxyControllerB,imp,32,add(imp,44),20)
            pop(r)
        }
        return imp[1];
    }

    function getOwner(address addr) public view returns(address){
        uint256[1] memory imp;
        address[1] memory res;
        address _proxyControllerB = proxyControllerB;
        assembly{
            mstore(imp,or(addr,0x010000000000000000000000000000000000000000))
            let r := staticcall(gas(),_proxyControllerB,imp,32,add(res,12),20)
            pop(r)
        }
        return res[0];
    }

    function setOwner(address addr,address newOwner) public{
        //require(getOwner(addr) == msg.sender, 'CALLER IS NOT THE OWNER');
        uint256[2] memory imp;
        address[1] memory actualOwner;
        address _proxyControllerB = proxyControllerB;

        assembly{
            let pointer := add(imp,32)
            mstore(pointer,or(addr,0x010000000000000000000000000000000000000000))
            let r := staticcall(gas(),_proxyControllerB,pointer,32,add(actualOwner,12),20)
            pop(r)
        }

        require(actualOwner[0] == msg.sender, 'CALLER IS NOT THE OWNER');

        assembly{
            // mstore(add(imp,32),or(addr,0x010000000000000000000000000000000000000000))
            mstore(imp,newOwner)
            let r := call(gas(),_proxyControllerB,0,imp,64,0,0)
            pop(r)
        }
        emit OwnerChanged(addr,newOwner);
    }

    function setImplementation(address addr,address newImplementation) public{
        require(newImplementation!=address(0),'IMPLEMENTATION CAN NOT BE ZERO');
        //require(getOwner(addr) == msg.sender, 'CALLER IS NOT THE OWNER');
        uint256[2] memory imp;
        address[1] memory actualOwner;
        address _proxyControllerB = proxyControllerB;

        assembly{
            mstore(imp,or(addr,0x010000000000000000000000000000000000000000))
            let r := staticcall(gas(),_proxyControllerB,imp,32,add(actualOwner,12),20)
            pop(r)
        }

        require(actualOwner[0] == msg.sender, 'CALLER IS NOT THE OWNER');

        assembly{
            mstore(imp,newImplementation)
            mstore(add(imp,32),addr)
            let r := call(gas(),_proxyControllerB,0,imp,64,0,0)
            pop(r)
        }
        emit ImplementationChanged(addr,newImplementation);
    }
}