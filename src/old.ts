import { ContractFactory } from "ethers";

/*
CONSTRUCTOR:
    PUSH2 0x1d2
    PUSH1 0x0
    DUP2
    PUSH1 0xb
    DUP3
    CODECOPY
    RETURN

    0x61
    0x01
    0xD2 //PUSH 473
    0x60
    0x00 // PUSH 0
    0x81 // DUP2 (289)
    0x60
    0x0B // PUSH 11
    0x82 // DUP3 (0)
    0x39 // CODECOPY
    0xF3 // RETURN
CONTROLLER:
    CALLVALUE
    PUSH2 0x1b4
    JUMPI
    CALLDATASIZE
    PUSH1 0x13
    JUMPI
    CALLER
    SLOAD
    PUSH1 0x0
    MSTORE
    PUSH1 0x14
    PUSH1 0xc
    RETURN
    JUMPDEST
    CALLDATASIZE
    PUSH1 0x40
    EQ
    PUSH1 0x65
    JUMPI
    PUSH1 0x0
    CALLDATALOAD
    PUSH1 0xe0
    SHR
    DUP1
    PUSH4 0xfa544161
    EQ
    PUSH1 0x92
    JUMPI
    DUP1
    PUSH4 0x15ac72ca
    EQ
    PUSH1 0xb6
    JUMPI
    DUP1
    PUSH4 0x299a7bcc
    EQ
    PUSH1 0xc3
    JUMPI
    DUP1
    PUSH4 0x8f8fbab4
    EQ
    PUSH2 0x118
    JUMPI
    PUSH18 0x46554e4354494f4e204e4f54204558495354
    PUSH1 0x0
    MSTORE
    PUSH1 0x12
    PUSH1 0xe
    REVERT
    JUMPDEST
    CALLER
    SLOAD
    PUSH1 0x8d
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
    PUSH1 0x0
    DUP1
    REVERT
    JUMPDEST
    PUSH1 0x4
    CALLDATALOAD
    PUSH21 0x10000000000000000000000000000000000000000
    OR
    SLOAD
    PUSH1 0x0
    MSTORE
    PUSH1 0x20
    PUSH1 0x0
    RETURN
    JUMPDEST
    PUSH1 0x4
    CALLDATALOAD
    SLOAD
    PUSH1 0x0
    MSTORE
    PUSH1 0x20
    PUSH1 0x0
    RETURN
    JUMPDEST
    PUSH1 0x4
    CALLDATALOAD
    PUSH21 0x10000000000000000000000000000000000000000
    OR
    DUP1
    SLOAD
    CALLER
    EQ
    ISZERO
    PUSH2 0x197
    JUMPI
    PUSH1 0x24
    CALLDATALOAD
    SWAP1
    SSTORE
    PUSH1 0x24
    CALLDATALOAD
    PUSH1 0x4
    CALLDATALOAD
    PUSH32 0xb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c
    PUSH1 0x0
    DUP1
    LOG3
    STOP
    JUMPDEST
    PUSH1 0x4
    CALLDATALOAD
    DUP1
    ISZERO
    PUSH2 0x110
    JUMPI
    PUSH21 0x10000000000000000000000000000000000000000
    OR
    SLOAD
    CALLER
    EQ
    ISZERO
    PUSH2 0x197
    JUMPI
    PUSH1 0x24
    CALLDATALOAD
    PUSH1 0x4
    CALLDATALOAD
    SSTORE
    PUSH1 0x24
    CALLDATALOAD
    PUSH1 0x4
    CALLDATALOAD
    PUSH32 0xcfbf4028add9318bbf716f08c348595afb063b0e9feed1f86d33681a4b3ed4d3
    PUSH1 0x0
    DUP1
    LOG3
    STOP
    JUMPDEST
    PUSH25 0x444952454354494f4e2043414e204e4f54204245205a45524f
    PUSH1 0x0
    MSTORE
    PUSH1 0x19
    PUSH1 0x7
    REVERT
    JUMPDEST
    PUSH19 0x43414c4c4552204953204e4f54204f574e459e
    PUSH1 0x0
    MSTORE
    PUSH1 0x13
    PUSH1 0xd
    REVERT
    JUMPDEST
    PUSH20 0x4e4f542050415941424c452046554e4354494f4e
    PUSH1 0x0
    MSTORE
    PUSH1 0x14
    PUSH1 0xc
    REVERT

    0x34 // calValue
    0x61 
    0x01
    0xB4 // PUSH DEST NOT PAYABLE FUNCTION
    0x57 // JUMPI
    0x36 //CALLDATASIZE
    0x60
    0x13 // DIRECTION OF JUMPI 1
    0x57 //JUMPI
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
    0x36 //CALLDATASIZE
    0x60
    0x40 // PUSH 64
    0x14 //EQ
    0x60
    0x65 // DIRECTION OF JUMPI 2
    0x57 //JUMPI
    0x60
    0x00 // PUSH 0
    0x35 // CALLDATALOAD
    0x60
    0xE0 // PUSH 224
    0x1C // SHR
    0x80 // DUP1 (FUNCTION NAME)
    0x63
    0xfa
    0x54
    0x41
    0x61 // PUSH getOwner(address)
    0x14 // EQ
    0x60
    0x92 // DIRECTION OF JUMPI GET OWNER
    0x57 //JUMPI
    0x80 // DUP1 (FUNCTION NAME)
    0x63
    0x15
    0xac
    0x72
    0xca // PUSH getImplementation(address)
    0x14 // EQ
    0x60
    0xB6 // DIRECTION OF JUMPI GET IMPLEMENTATION
    0x57 //JUMPI
    0x80 // DUP1 (FUNCTION NAME)
    0x63
    0x29
    0x9a
    0x7b
    0xcc // PUSH setOwner(address,address)
    0x14 // EQ
    0x60
    0xC3 // DIRECTION OF JUMPI SET OWNER
    0x57 //JUMPI
    0x80 // DUP1 (FUNCTION NAME)
    0x63
    0x8f
    0x8f
    0xba
    0xb4 // PUSH setImplementation(address,address)
    0x14 // EQ
    0x61
    0x01
    0x18 // DIRECTION OF JUMPI SET IMPLEMENTATION
    0x57 //JUMPI
    0x71
    0x46
    0x55
    0x4e
    0x43
    0x54
    0x49
    0x4f
    0x4e
    0x20
    0x4e
    0x4f
    0x54
    0x20
    0x45
    0x58
    0x49
    0x53
    0x54 // PUSH FUNCTION NOT EXIST
    0x60
    0x00 // PUSH 0
    0x52 // MSTORE
    0x60
    0x12 // PUSH 18
    0x60
    0x0E // PUSH 14
    0xFD // REVERT
    0x5B //DEST JUMPI 2
    0x33 // msg.caller
    0x54 //SLOAD
    0x60
    0x8D // DIRECTION OF JUMPI 3
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
    0x5B //DEST JUMPI 3
    0x60
    0x00 // PUSH 0
    0x80 // DUP1(0)
    0xFD // REVERT
    0x5B // DEST GET OWNER
    0x60
    0x04 // PUSH 4
    0x35 // CALLDATALOAD
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
    0x54 //SLOAD
    0x60
    0x00 //PUSH 0
    0x52 //MSTORE
    0x60
    0x20 //PUSH 32
    0x60
    0x00 // PUSH 0
    0xF3 // RETURN
    0x5B // DEST GET IMPLEMENTATION
    0x60
    0x04 // PUSH 4
    0x35 // CALLDATALOAD
    0x54 //SLOAD
    0x60
    0x00 //PUSH 0
    0x52 //MSTORE
    0x60
    0x20 //PUSH 32
    0x60
    0x00 // PUSH 0
    0xF3 // RETURN
    0x5B // DEST SET OWNER
    0x60
    0x04 // PUSH 4
    0x35 // CALLDATALOAD
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
    0x80 // DUP1
    0x54 //SLOAD
    0x33 // CALLER
    0x14 // EQ
    0x15 // ISZERO
    0x61
    0x01
    0x97 // PUSH DIRECTION OF JUMPI CALLER NOT OWNER
    0x57 //JUMPI
    0x60
    0x24 // PUSH 36
    0x35 // CALLDATALOAD
    0x90 // SWAP1
    0x55 // SSTORE
    0x60
    0x24 // PUSH 36
    0x35 // CALLDATALOAD
    0x60
    0x04 // PUSH 4
    0x35 // CALLDATALOAD
    0x7F //PUSH OwnerChanged
    0xb5
    0x32
    0x07
    0x3b
    0x38
    0xc8
    0x31
    0x45
    0xe3
    0xe5
    0x13
    0x53
    0x77
    0xa0
    0x8b
    0xf9
    0xaa
    0xb5
    0x5b
    0xc0
    0xfd
    0x7c
    0x11
    0x79
    0xcd
    0x4f
    0xb9
    0x95
    0xd2
    0xa5
    0x15
    0x9c
    0x60
    0x00 // PUSH 0
    0x80 // DUP1 (0)
    0xA3 // LOG3
    0x00 // STOP
    0x5B // DEST SET IMPLEMENTATION
    0x60
    0x04 // PUSH 4
    0x35 // CALLDATALOAD
    0x80 // DUP1
    0x15 // ISZERO
    0x61
    0x01
    0x10 // PUSH DIRECTION OF JUMPI NOT ZERO
    0x57 // JUMPI
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
    0x54 //SLOAD
    0x33 // CALLER
    0x14 // EQ
    0x15 // ISZERO
    0x61
    0x01
    0x97 // PUSH DIRECTION OF JUMPI CALLER NOT OWNER
    0x57 //JUMPI
    0x60
    0x24 // PUSH 36
    0x35 // CALLDATALOAD
    0x60
    0x04 // PUSH 4
    0x35 // CALLDATALOAD
    0x55 // SSTORE
    0x60
    0x24 // PUSH 36
    0x35 // CALLDATALOAD
    0x60
    0x04 // PUSH 4
    0x35 // CALLDATALOAD
    0x7F //PUSH ImplementationChanged
    0xcf
    0xbf
    0x40
    0x28
    0xad
    0xd9
    0x31
    0x8b
    0xbf
    0x71
    0x6f
    0x08
    0xc3
    0x48
    0x59
    0x5a
    0xfb
    0x06
    0x3b
    0x0e
    0x9f
    0xee
    0xd1
    0xf8
    0x6d
    0x33
    0x68
    0x1a
    0x4b
    0x3e
    0xd4
    0xd3
    0x60
    0x00 // PUSH 0
    0x80 // DUP1 (0)
    0xA3 // LOG3
    0x00 // STOP
    0x5B //DIRECTION OF JUMPI NOT ZERO
    0x78
    0x44
    0x49
    0x52
    0x45
    0x43
    0x54
    0x49
    0x4f
    0x4e
    0x20
    0x43
    0x41
    0x4e
    0x20
    0x4e
    0x4f
    0x54
    0x20
    0x42
    0x45
    0x20
    0x5a
    0x45
    0x52
    0x4f // DIRECTION CAN NOT BE ZERO
    0x60
    0x00 // PUSH 0
    0x52 // MSTORE
    0x60
    0x19 // PUSH 25
    0x60
    0x07 // PUSH 7
    0xFD // REVERT
    0x5B //DEST CALLER NOT OWNER
    0x72
    0x43
    0x41
    0x4c
    0x4c
    0x45
    0x52
    0x20
    0x49
    0x53
    0x20
    0x4e
    0x4f
    0x54
    0x20
    0x4f
    0x57
    0x4e
    0x45
    0x9E // PUSH CALLER IS NOT OWNER
    0x60
    0x00 // PUSH 0
    0x52 // MSTORE
    0x60
    0x13 // PUSH 19
    0x60
    0x0D // PUSH 13
    0xFD // REVERT
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
    0xFD
*/

const ProxyController__factory = new ContractFactory(
  [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "contr",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newImp",
          type: "address",
        },
      ],
      name: "ImplementationChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "contr",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnerChanged",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      name: "getImplementation",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      name: "getOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
        {
          internalType: "address",
          name: "newImplementation",
          type: "address",
        },
      ],
      name: "setImplementation",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
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
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  "0x6101D2600081600B8239F3346101B4573660135733546000526014600CF35B3660401460655760003560E01C8063fa54416114609257806315ac72ca1460B6578063299a7bcc1460C35780638f8fbab414610118577146554e4354494f4e204e4f542045584953546000526012600EFD5B3354608D57602035335560003533740100000000000000000000000000000000000000001755005B600080FD5B60043574010000000000000000000000000000000000000000175460005260206000F35B6004355460005260206000F35B600435740100000000000000000000000000000000000000001780543314156101975760243590556024356004357Fb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c600080A3005B60043580156101105774010000000000000000000000000000000000000000175433141561019757602435600435556024356004357Fcfbf4028add9318bbf716f08c348595afb063b0e9feed1f86d33681a4b3ed4d3600080A3005B78444952454354494f4e2043414e204e4f54204245205a45524f60005260196007FD5B7243414c4c4552204953204e4f54204f574e459E6000526013600DFD5B734e4f542050415941424c452046554e4354494f4e6000526014600CFD"
);

export { ProxyController__factory };
