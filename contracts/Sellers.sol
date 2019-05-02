pragma solidity ^0.5.0;

import "./TutorialToken.sol";

contract Sellers{

    
    TutorialToken _tt;
    // calling a seperate contract
    constructor(address _f) public
    {
        _tt = TutorialToken(_f);
    }
    
    string public message;
 
    function setMessage(string memory _message) public 
    {
        message = _message;
    }

    function getMessage() public view returns (string memory) 
    {
        return message;
    }

    // generate a random number between 500 and 1000
    uint nonce = 1;
    function randomNumber() internal returns (uint) 
    {
        uint randomnumber = uint(keccak256(abi.encodePacked(nonce))) % 500;
        nonce++;
        randomnumber = randomnumber + 500;
        return randomnumber;
    }

    struct User {
        string name;
        string companyName;
        int numYearsExperience;
        int pricePerHour;
        string specialisation;
        string summary;
        int numAdsViewed;
        int numAdsPurchased;
        bool set;
    }

    // structure to contain extra data the system needs 
    struct UserExtra {
        string website;
        string photo;
    }


    struct UserParamaters {
        int minAge;
        int minNumInteractions;
        int minNumPurchases;
        int minScore;
        bool emailProvided;
        bool set;

    }    


    // mapping of address to User struct
    mapping(address => User) public users;

    // mapping of address to extra-data User struct
    mapping(address => UserExtra) public usersExtra;

    // mapping of address to UserParamaters struct
    mapping(address => UserParamaters) public userParams;

    // this is a mapping of all past purchases (i.e. list of buyer addresses for a given seller address)
    mapping(address => address[]) pastBuyers;

    // list of all the addresses
    address[] addressArray;

    function createUser(
        address _address, 
        string memory _name, 
        string memory _companyName, 
        int _numYearsExperience, 
        int _pricePerHour, 
        string memory _specialisation, 
        string memory _summary,
        int _numAdsViewed,
        int _numAdsPurchased,
        string memory _website,
        string memory _photo
        ) public 

    {
        
        address _userAddress = _address;
        
        // Storage for user
        User storage user = users[_userAddress];


        
        // Check that the user did not already exist
        if(user.set)
        {
            delete(users[_userAddress]);

              //Store the user
            users[_userAddress] = User({
                name: _name,
                companyName: _companyName,
                numYearsExperience: _numYearsExperience,
                pricePerHour: _pricePerHour,
                specialisation: _specialisation,
                summary: _summary,
                set: true,
                numAdsViewed: _numAdsViewed,
                numAdsPurchased: _numAdsPurchased
            });


            // set the extra data needed for a seller 
            usersExtra[_userAddress] = UserExtra({
                website: _website,
                photo: _photo
            });


        }
        else
        {
            //Store the user
            users[_userAddress] = User({
                name: _name,
                companyName: _companyName,
                numYearsExperience: _numYearsExperience,
                pricePerHour: _pricePerHour,
                specialisation: _specialisation,
                summary: _summary,
                set: true,
                numAdsViewed: _numAdsViewed,
                numAdsPurchased: _numAdsPurchased
            });

            // set the extra data needed for a seller 
            usersExtra[_userAddress] = UserExtra({
                website: _website,
                photo: _photo
            });
        }
        
        // add to array
        addressArray.push(_userAddress);

        uint number = randomNumber();

        // set the balance of each user
        _tt.setBalanceOf(_userAddress, number);
    }
    
    function setSellerParamaters(
        address _address, 
        bool _emailProvided, 
        int _minAge, 
        int _minNumInteractions, 
        int _minNumPurchases, 
        int _minScore) public
    {

        // Storage for user
        UserParamaters storage userParam = userParams[_address];

        
        // Check that the user did not already exist
        if(userParam.set)
        {
            delete(users[_address]);

              //Store the user
            userParams[_address] = UserParamaters({
                emailProvided: _emailProvided,
                minAge: _minAge,
                minNumInteractions: _minNumInteractions,
                minNumPurchases: _minNumPurchases,
                minScore: _minScore,
                set: true
            });
        }
        else
        {
            //Store the user
            userParams[_address] = UserParamaters({
                emailProvided: _emailProvided,
                minAge: _minAge,
                minNumInteractions: _minNumInteractions,
                minNumPurchases: _minNumPurchases,
                minScore: _minScore,
                set: true
            });
        }
    }

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

    // function to check if an Ethereum address already exists in the system
    function initialised() public view returns (bool)
    {
        if(addressArray.length == 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    }


    function getAddressList() public view returns (address[] memory)
    {
        return addressArray;
    }
    

    function getSellerInfo(address _address) public view returns(
        string memory name,
        string memory companyName,
        int numYearsExperience,
        int pricePerHour,
        string memory specialisation,
        string memory summary,
        string memory website)
    {
        return (
            users[_address].name,
            users[_address].companyName,
            users[_address].numYearsExperience,
            users[_address].pricePerHour,
            users[_address].specialisation,
            users[_address].summary,    
            usersExtra[_address].website
        );
    }

    function getWebsite(address _address) public view returns(string memory)
    {
        return usersExtra[_address].website;        
    }

    function getPhoto(address _address) public view returns(string memory)
    {
        return usersExtra[_address].photo;        
    }



 
    // SEARCH PARAMATERS
    int public maxPricePerHour;
    int public minYearsExperience;
    string public specialisation;


    function setSearchParams(
        int _maxPricePerHour, 
        int _minYearsExperience, 
        string memory _specialisation) public returns(bool)
    { 
        maxPricePerHour = _maxPricePerHour;
        minYearsExperience = _minYearsExperience;
        specialisation = _specialisation;
        return true;
    }
  
    function getMaxPricePerHour() public view returns(int)
    {   
        return maxPricePerHour;
    }

    function getMinYearsExperience() public view returns(int)
    {   
        return minYearsExperience;
    }

    function getSpecialisation() public view returns(string memory)
    {   
        return specialisation;
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

    // return the number of ads purchased for a given seller
    function getNumAdsPurchased(address _address) public view returns(int)
    {   
        return users[_address].numAdsPurchased;
    }

    // increment the number of ads purchased for a given seller
    function incrementNumAdsPurchased(address _address) public
    {
        users[_address].numAdsPurchased += 1; 
    }

    // add to the mapping, this is called as a BUYER!
    function addPastBuyer(address sellerAddress, address userAddress) public
    {
        pastBuyers[sellerAddress].push(userAddress);

        // increment the number of ads purchased
        users[sellerAddress].numAdsPurchased += 1; 
    }

    // this is called as a SELLER
    function getPastBuyers(address sellerAddress) public view returns(address[] memory)
    {
        return pastBuyers[sellerAddress];
    }

    function getMinAge(address _address) public view returns(int)
    {
        return userParams[_address].minAge;
    }

    function getMinScore(address _address) public view returns(int)
    {
        return userParams[_address].minScore;
    }
    function getMinNumInteractions(address _address) public view returns(int)
    {
        return userParams[_address].minNumInteractions;
    }
    function getMinNumPurchases(address _address) public view returns(int)
    {
        return userParams[_address].minNumPurchases;
    }
    function getEmailProvided(address _address) public view returns(bool)
    {
        return userParams[_address].emailProvided;
    }

}