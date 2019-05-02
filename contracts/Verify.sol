pragma solidity ^0.5.0;

contract Verify {

    function verify(bytes32 hashedMessage, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hashedMessage));
        address signer = ecrecover(prefixedHash, v, r, s);
        return signer;
    }
}