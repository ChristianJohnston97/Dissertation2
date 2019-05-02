pragma solidity ^0.5.0;

contract Users{

    struct User {
        string firstName;
        string secondName;
        string email;
        int age;
        bool verified;
        int personalDataScore;
        int adsPurchased;
        int numAdsViewed;
        bool set; // This boolean is used to differentiate between unset and zero struct values
    }   

    mapping(address => User) public users;


    // list of all the addresses
    address[] addressArray;


    event UserMade(
        string name
    );


    // function to check if an Ethereum address already exists in the system
    function doesUserExist(address adr) public view returns (bool)
    {
        if(users[adr].set == true)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function isUserVerified(address adr) public view returns (bool)
    {
        if(users[adr].verified == true)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // sets verified
    function setVerified(address adr) public 
    {
        users[adr].verified = true;
    }



    function createUser(address _address, string memory _firstName, string memory _secondName, string memory _email, int _age, int score) public 
    {
    

        address _userAddress = _address;

        // Storage for list of users
        User storage user = users[_userAddress];

        // if user already exists, delete the user 
        if(user.set)
        {
            delete(users[_userAddress]);
            //Store the 'updated' user
            users[_userAddress] = User({
                firstName: _firstName,
                secondName: _secondName,
                email: _email,
                age: _age,
                verified: false,
                personalDataScore: score,
                adsPurchased: 0,
                numAdsViewed: 0,
                set: true
            });
        }
        else
        {
            //Store the user
            users[_userAddress] = User({
                firstName: _firstName,
                secondName: _secondName,
                email: _email,
                age: _age,
                verified: false,
                personalDataScore: score,
                adsPurchased: 0,
                numAdsViewed: 0,
                set: true
            });
            // add to array
            addressArray.push(_userAddress);
        }

    }

    function getAddressList() public view returns (address[] memory)
    {
        return addressArray;
    }

    function getUserInfo(address _address) public view returns(string memory firstName, string memory secondName, string memory email, int age)
    {
        return (
            users[_address].firstName,
            users[_address].secondName,
            users[_address].email,
            users[_address].age
        );
    }

    function getPersonalDataScore(address _address) public view returns(int)
    {
        return users[_address].personalDataScore;
    }


    // get the total number of ads purchased
    function getNumAdsPurchased(address _address) public view returns(int)
    {
        return users[_address].adsPurchased;
    }

    // return the number of ads viewed for a given seller
    function getNumAdsViewed(address _address) public view returns(int)
    {   
        return users[_address].numAdsViewed;
    }

    // increment the number of ads viewed of a given seller
    function incrementNumAdsViewed(address _address) public
    {
        users[_address].numAdsViewed += 1; 
    }

    // increment the number of ads purchased for a given seller
    function incrementNumAdsPurchased(address _address) public
    {
        users[_address].adsPurchased += 1; 
    }
}