pragma solidity ^0.5.0;

contract TutorialToken {
    string public constant symbol = "CPT";
    string public constant name = "Consumer participation token";
    
    uint public constant decimals = 18;
    
    // total supply fixed
    uint private _totalSupply;

    // supply of CPT tokens for contract caller
    uint private initialSupply = 100;
    
    mapping(address => uint) private balances;
    mapping(address => mapping (address => uint)) private allowances;


    // constuctor 
    constructor() public
    {
        _totalSupply = initialSupply * 10 ** uint256(decimals);
        balances[msg.sender] = initialSupply;
    }




    // return total supply
    function totalSupply() public view returns (uint)
    {
        return _totalSupply;
    }
    
    // return the balance of a particlar address
    function balanceOf(address addr) public view returns (uint balance)
    {
        return balances[addr];
    }

    // return the balance of a particlar address
    function setBalanceOf(address addr, uint value) public returns (uint balance)
    {
        return balances[addr] = value;
    }

    // increase balance of specified address
    function increaseBalance(address _address, uint value) public returns (bool)
    {
        balances[_address] += value;
        return true;
    }

    function updateBalances(address sellerAddress, uint value) public returns (bool)
    {
        // if the seller does not have sufficient balance, return false
        if(balances[sellerAddress] < value)
        {
            return false;
        }
        // else, update balances
        else
        {
            balances[msg.sender] += value;
            balances[sellerAddress] -= value;
            return true;
        }
    }

    // transfer token from contract owner to another address
    function transfer(address to, uint value) public returns (bool success)
    {
        if(value > 0 && value <= balanceOf(msg.sender))
        {
            uint previousBalances = balanceOf(msg.sender) + balanceOf(to);
            
            //actual subtraction and addition
            balances[msg.sender] -= value;
            balances[to] += value;
            
            //emit transfer
            //emit Transfer(msg.sender, to, value);
            
            // for error checking, should never fail
            assert(balanceOf(msg.sender) + balanceOf(to) == previousBalances);
            return true;
        }
        return false;
    }
    
    function transferFrom(address _from, address _to, uint _value) public returns (bool success)
    {
        if(allowances[_from][msg.sender] > 0 && allowances[_from][msg.sender] >= _value && _value > 0 && allowances[_from][msg.sender] > _value)
        {
            uint previousBalances = balanceOf(_from) + balanceOf(_to);

            balances[_from] -= _value;
            balances[_to] += _value;
            
             //emit transfer
            //emit Transfer(msg.sender, _to, _value);
            
            // for error checking, should never fail
            assert(balanceOf(_from) + balanceOf(_to) == previousBalances);
            return true;
        }
        return false;
    }
    
    
    //Set allowance for other address
    // Allows _spender to spend no more than _value tokens on your behalf
    function approve(address _spender, uint _value) public returns (bool success)
    {
        allowances[msg.sender][_spender] = _value;
        //emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
  
    
    function allowance(address owner, address spender) external view returns (uint remaining)
    {
        return allowances[owner][spender];
    }
}