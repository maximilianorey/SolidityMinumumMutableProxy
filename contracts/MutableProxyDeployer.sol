//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
CONSTRUCTOR:
    PUSH20 0x-- // DIRECTION OF OWNER
    PUSH1 0x0
    MSTORE
    PUSH20 0x-- // DIRECTION OF IMPLEMENTATION
    PUSH1 0x20
    MSTORE
    PUSH1 0x0
    DUP1
    PUSH1 0x40
    DUP2
    DUP1
    PUSH20 0x-- // DIRECTION OF CONTROLLER
    GAS
    CALL
    PUSH1 0x3f
    DUP1
    PUSH1 0x59
    PUSH1 0x0
    CODECOPY
    PUSH1 0x0
    RETURN

CONSTRUCTOR CODE BINARY:
    0x73 // The following zeros will be overwritten by the address of owner
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
    0x60
    0x00 //PUSH 0
    0x52 //MSTORE
    0x73 // The following zeros will be overwritten by the address of implementation
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
    0x60
    0x20 //PUSH 32
    0x52 //MSTORE
    0x60
    0x00 // PUSH 0 (RET LENGTH)
    0x80 // DUP1 (0) (RET OFFSET)
    0x60
    0x40 // PUSH 64 (ARGS LENGTH)
    0x81 // DUP 2 (0)
    0x80 // DUP 1 (0) VALUE
    0x73 // The following zeros will be overwritten by the address of controller
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
    0x5A // GAS
    0xF1 // CALL
    0x60
    0x3F // CODE LENGTH
    0x80 // DUP1 (CODE LENGTH)
    0x60
    0x59 // CODE OFFSET
    0x60
    0x00 // DEST OFFSET
    0x39 // CODECOPY
    0x60
    0x00 // PUSH(0)
    0xF3 // RETURN

PROXY CODE:
    PUSH1 0x14
    PUSH1 0xc
    PUSH1 0x0
    DUP1
    PUSH20 0x-- // DIRECTION OF CONTROLLER
    GAS
    STATICCALL
    CALLDATASIZE
    PUSH1 0x0
    PUSH1 0x20
    CALLDATACOPY
    PUSH1 0x0
    CALLDATASIZE
    CALLDATASIZE
    PUSH1 0x20
    DUP4
    MLOAD
    GAS
    DELEGATECALL
    RETURNDATASIZE
    PUSH1 0x0
    DUP1
    RETURNDATACOPY
    PUSH1 0x3a
    JUMPI
    RETURNDATASIZE
    PUSH1 0x0
    REVERT
    JUMPDEST
    RETURNDATASIZE
    PUSH1 0x0
    RETURN

PROXY BINARY CODE:
    0x60
    0x14 // PUSH 20 (RET LENGTH)
    0x60
    0x0C // PUSH 12 (RET OFFSET)
    0x60
    0x00 // PUSH 0 (ARGS LENGTH)
    0x80 // DUP1 (0) (ARGS OFFSET)
    0x73 // push20. The following zeros will be overwritten by the address of controller
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
    0x5A // GAS
    0xFA // STATIC CALL
    0x36 // call data size
    0x60
    0x00 // PUSH 0
    0x60
    0x20 // PUSH 32
    0x37 // calldatacopy
    0x60
    0x00 // PUSH (0) (RET LENGTH)
    0x36 // call data size (ret offset)
    0x36 // call data size (args length)
    0x60
    0x20 // PUSH 32 (ARGS OFFSET)
    0x83 // DUP 4 (0)
    0x51 // MLOAD
    0x5A // gas
    0xF4 // delegate call
    0x3D //returnDataSize
    0x60
    0x00
    0x80 //DUP1 (0) (ret offset)
    0x3E //return data copy
    0x60
    0x3A // push 58
    0x57 //jumpi
    0x3D //returnDataSize
    0x60
    0x00 // PUSH 0 (ret offset)
    0xFD //revert
    0x5B //jumpdest
    0x3D //returnDataSize
    0x60
    0x00 // PUSH 0 (ret offset)
    0xF3 //return

    0x730000000000000000000000000000000000000000600052730000000000000000000000000000000000000000602052600080604081807300000000000000000000000000000000000000005AF1603F8060596000396000F36014600C6000807300000000000000000000000000000000000000005AFA36600060203760003636602083515AF43D6000803E603A573D6000FD5B3D6000F3
*/

contract MutableProxyDeployer {
    event ProxyDeployed(address indexed addrProxy, address indexed addrOwner, address indexed addrImpl);

    function deployProxy(address controller, address owner, address implementation) public returns(address){
        uint256[5] memory code;
        address res;
        assembly{
            mstore(code,or(0x7300000000000000000000000000000000000000006000527300000000000000,shl(88,owner)))
            mstore(add(code,25),or(0x0000000000000000000000000000000000000000602052600080604081807300,shl(96,implementation)))
            mstore(add(code,56),or(0x00000000000000000000000000000000000000005AF1603F8060596000396000,shl(96,controller)))
            mstore(add(code,88),or(0xF36014600C6000807300000000000000000000000000000000000000005AFA36,shl(24,controller)))
            mstore(add(code,120),0x600060203760003636602083515AF43D6000803E603A573D6000FD5B3D6000F3)
            res := create(0,code,152)
        }
        emit ProxyDeployed(res,owner,implementation);
        return res;
    }
}