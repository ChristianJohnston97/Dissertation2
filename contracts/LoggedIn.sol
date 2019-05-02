pragma solidity ^0.5.0;
contract LoggedIn {

    address public _address;

    function setAddress(address __address) public
    {
        _address = __address;
    }

    function getAddress() public view returns (address) 
    {
        return _address;
    }
}