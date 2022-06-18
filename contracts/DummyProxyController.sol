//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DummyProxyController{
    event OwnerChanged(address indexed contr, address indexed newOwner);
    event ImplementationChanged(address indexed contr, address indexed newImp);
    function getImplementation(address addr) public view returns(address){
        return address(0);
    }

    function getOwner(address addr) public view returns(address){
        return address(0);
    }

    function setOwner(address addr,address newOwner) public{
        emit OwnerChanged(addr,newOwner);
    }

    function setImplementation(address addr,address newImplementation) public{
        emit ImplementationChanged(addr,newImplementation);
    }
}