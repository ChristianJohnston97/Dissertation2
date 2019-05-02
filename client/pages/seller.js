import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Layout from '../components/myLayout'
import Router from 'next/router'
import { Form, FormGroup, Label, CustomInput, Input, Container, Modal, Card, CardGroup, Button, CardImg, CardTitle, CardText, Row, Col, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';
import StarRatingComponent from 'react-star-rating-component';

// client side assymetric encryption
var EthCrypto = require('eth-crypto');

// assmetric encryption library 
const ecies = require("eth-ecies");

// import CSS styling
import '../components/seller.css'


// comparison function to rank the list of advertisers
function compare(a,b) 
{
    if (a.CPT < b.CPT)
      return 1;
    if (a.CPT > b.CPT)
      return -1;
    return 0;
}



class Entry extends React.Component {
    constructor(props) {
        super(props);

    this.state = {
            address: props.advertiser.address,
            photo: props.advertiser.photo
        };
    }

    render() {

        <br></br>

      return (
        <Col className="spacing" lg="4" sm="6" xs="12">
          <Card body>
            <CardImg id = "photo" top width="100%" src= {this.state.photo} />
            <StarRatingComponent 
              starCount={5}
              editing={false}
              value={this.props.advertiser.sellerScore}
            />
            <CardTitle id = "title">{this.props.advertiser.CPT} CPT</CardTitle>
            <CardText><b>Name: </b>{this.props.advertiser.name}</CardText>
            <CardText><b>Price per hour: </b>{this.props.advertiser.pricePerHour}</CardText>
            <CardText><b>Years Experience: </b>{this.props.advertiser.numYearsExperience}</CardText>
            <CardText><b>Specialisation: </b>{this.props.advertiser.specialisation}</CardText>

            <Button onClick = {() => this.props.getMoreInfo(this.props.advertiser.address)}>More info</Button>

          </Card>
        </Col>
        
      );
    }
}

class ModalExample extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modal: false
      };
      this.toggle = this.toggle.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.purchaseAd = this.purchaseAd.bind(this);


    }

    componentDidMount()
    {
        this.setState({ address: this.props.address })
    }
  
    toggle() {
        this.setState({
        modal: !this.state.modal
      });
    }

    handleChange(event) {
        this.props.onChange();
    }

    
    purchaseAd(address) {
        this.props.purchaseAd(address);
    }         


    render() {
      return (
        <div>
          <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={this.props.className}>
            <ModalHeader toggle={this.handleChange}>Summary</ModalHeader>
            <ModalBody>
              {this.props.info.summary}
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick = {() => this.props.purchaseAd(this.props.address)}>Purchase</Button>
          </ModalFooter>
          </Modal>
        </div>
      );
    }
}

class Seller extends React.Component {
    constructor(props) {
        super(props);
        var data = require('./sellerData.json');
        this.state = {
            sellerData: data,
            info: '',
            isModalOpen: false,
            specificAddress: '',
            ranked: false,
            modal2Show: false,
            modal3Show: false,
            messageHash: '',
            CPT: '',
            mobileNumber: ''
        };
        this.toggle = this.toggle.bind(this);
        this.toggle2 = this.toggle2.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);

    }

    exit = async (event) => 
    {
        Router.push('/')
    }


    toggle() {
        this.setState({
            modal2Show: !this.state.modal2Show
        });
    }


    toggle2() {
        this.setState({
            modal3Show: !this.state.modal3Show
        });
    }

    componentDidMount = async () =>
    {
        const advertiserInfo = await this.getAdvertiserInfo()
        // sort the list of advertisers based on CPT tokens
        advertiserInfo.sort(compare);
        this.setState({ sellerData: advertiserInfo })

        // set ranked
        this.setState({ranked:true});

    }

    getAdvertiserInfo = async () =>
    {
      var advertiserInfo = []
      const { accounts, sellContract, tokenContract, userContract, logContract } = this.props

      // get address of currently logged-in account (buyer)
      var address = await logContract.methods.getAddress().call()

      const addressList = await sellContract.methods.getAddressList().call()

      // user defined search paramaters 
      var maxPricePerHour = await sellContract.methods.getMaxPricePerHour().call()
      var minYearsExperience = await sellContract.methods.getMinYearsExperience().call()
      var _specialisation = await sellContract.methods.getSpecialisation().call()

      // personal score - how much personal info they have committed to systsem
      // score out of 5
      var personalDataScore = await userContract.methods.getPersonalDataScore(address).call()

      // get transaction history score of user
      // score out of 5
      var numAdsViewed = await userContract.methods.getNumAdsViewed(address).call()
      var numAdsPurchased = await userContract.methods.getNumAdsPurchased(address).call()
      var starScore = (5*numAdsPurchased)/(numAdsViewed)


      // get the user personal data information 
      var userInfo = await userContract.methods.getUserInfo(address).call()
      var age = userInfo.age
      var email = userInfo.email
      

      // loop through the list of sellers and get all of their information 
      for (const address of addressList) 
      {
        const sellerInfo = await sellContract.methods.getSellerInfo(address).call()

        var name = sellerInfo.name
        var companyName = sellerInfo.companyName
        var numYearsExperience = sellerInfo.numYearsExperience
        var pricePerHour = sellerInfo.pricePerHour
        var specialisation = sellerInfo.specialisation
        var summary = sellerInfo.summary

        // get photo
        var photo = await sellContract.methods.getPhoto(address).call()


        // seller defined paramaters
        var minAge = await sellContract.methods.getMinAge(address).call()
        var minScore = await sellContract.methods.getMinScore(address).call()
        var minNumInteractions = await sellContract.methods.getMinNumInteractions(address).call()
        var minNumPurchases = await sellContract.methods.getMinNumPurchases(address).call()
        var emailProvided = await sellContract.methods.getEmailProvided(address).call()
        
        // if the age of the buyer is less than the minimum required age, skip.
        if(age < minAge || starScore < minScore || numAdsViewed < minNumInteractions || numAdsPurchased < minNumPurchases)
        {
            continue;
        }

        // if the user has not set their email but seller has requested it to be set, skip.
        if(emailProvided == true && email == "")
        {
            continue;
        }
        
        // this is to get the star rating of each SELLER
        var sellerNumAdsViewed = await sellContract.methods.getNumAdsViewed(address).call() 
        var sellerNumAdsPurchased = await sellContract.methods.getNumAdsPurchased(address).call() 
        var sellerScore = ((sellerNumAdsPurchased)/(sellerNumAdsViewed))*5
        
        // the amount of CPT tokens to be transferred
        var CPT;

        // this is the minimum amount associated with an ad
        var baseCPT = 10;

        // initialise CPT
        CPT = baseCPT

        // total amount of CPT

        if(personalDataScore == 1)
        {
            CPT = CPT * 1.2
        }
        else if(personalDataScore == 2)
        {
            CPT = CPT * 1.4
        }
        else if(personalDataScore == 3)
        {
            CPT = CPT * 1.6
        }
        else if(personalDataScore == 4)
        {
            CPT = CPT * 1.8
        }
        else if(personalDataScore == 5)
        {
            CPT = CPT * 2
        }
    
        // seller score 
        if(sellerScore == 1)
        {
            CPT = CPT * 1.2
        }
        else if(sellerScore == 2)
        {
            CPT = CPT * 1.4
        }
        else if(sellerScore == 3)
        {
            CPT = CPT * 1.6
        }
        else if(sellerScore == 4)
        {
            CPT = CPT * 1.8
        }
        else if(sellerScore == 5)
        {
            CPT = CPT * 2
        }

        // starScore

        if(starScore == 1)
        {
            CPT = CPT * 1.2
        }
        else if(starScore == 2)
        {
            CPT = CPT * 1.4
        }
        else if(starScore == 3)
        {
            CPT = CPT * 1.6
        }
        else if(starScore == 4)
        {
            CPT = CPT * 1.8
        }
        else if(starScore == 5)
        {
            CPT = CPT * 2
        }

        // generate a random float between 0.8 and 1.2
        var random = Math.random() * (+1.2 - +0.8) + +0.8; 
        // multiply the random number
        CPT = CPT * random

        // to make in an integer
        CPT = Math.ceil(CPT)

        //get seller balance
        const balance = await tokenContract.methods.balanceOf(address).call()

        // if seller balance is less than the CPT, set CPT to balance
        if(balance < CPT)
        {
            CPT = balance;
        }

        
        // if any of the conditions aren't met
        if(parseInt(pricePerHour) > parseInt(maxPricePerHour) || parseInt(numYearsExperience) < parseInt(minYearsExperience))
        {
            continue
        }
        else
        {
            if(_specialisation == "Any")
            {
                // do nothing
            }
            else if(_specialisation != specialisation)
            {
                continue;
            }
        }

        
        var advertiser = {
            address: address,
            name: name,
            companyName: companyName,
            numYearsExperience: numYearsExperience, 
            pricePerHour: pricePerHour,
            specialisation: specialisation,
            summary: summary,
            photo: photo,
            sellerScore: sellerScore,
            CPT: CPT
        }
        advertiserInfo.push(advertiser)
      }
      return advertiserInfo
    }

    
    purchaseAd = async (sellerAddress) =>
    {
        const { accounts, tokenContract, userContract, sellContract, logContract} = this.props

        var buyerAddress = await logContract.methods.getAddress().call()

        const advertiserInfo = this.state.sellerData

        // CPT is the amount to be transferred 
        var CPT;
        for (var i = 0; i < advertiserInfo.length; i++)
        {
            if (advertiserInfo[i].address == sellerAddress)
            {
                CPT = advertiserInfo[i].CPT;
                // removes the advertisement from the list
                //advertiserInfo.splice(i, 1)
            }
        }

        // if remove the advertiser from the list
        this.setState({ sellerData: advertiserInfo })

        // CPT to be transferred 
        this.setState({ CPT: CPT })


        // update the balance for both buyer and seller (transfer +- CPT)
        await tokenContract.methods.updateBalances(sellerAddress, CPT).send({ from: accounts[0] })

        // add to list of past buyers for a given seller
        await sellContract.methods.addPastBuyer(sellerAddress, buyerAddress).send({ from: accounts[0] })

        // increment num ads purchased for buyer
        await userContract.methods.incrementNumAdsPurchased(buyerAddress).send({ from: accounts[0] })

        // increment num ads purchased for seller
        await sellContract.methods.incrementNumAdsPurchased(sellerAddress).send({ from: accounts[0] })

        // opens input box dialogue
        this.toggle2()

        // closes 'purchases' modal
        this.handleFieldChange()


    }


    completePurchase = async () =>
    {
        const { accounts, sellContract} = this.props

        // leave contact number for seller
        var message =  this.state.mobileNumber
        
        const messageHash = EthCrypto.hash.keccak256(message);

        // set the mssage hash
        this.setState({ messageHash: messageHash })

        await sellContract.methods.setMessage(message).send({ from: accounts[0] })

        // closes mobile phone modal
        this.toggle2()

        // opens purchase receipt modal
        this.toggle()

    }

    getMoreInfo = async (sellerAddress) =>
    {
        const { accounts, sellContract, userContract, logContract} = this.props

        var buyerAddress = await logContract.methods.getAddress().call()

        var info = await sellContract.methods.getSellerInfo(sellerAddress).call()
        this.setState({ info: info })
        this.setState({ isModalOpen: true })
        this.setState({ specificAddress: sellerAddress })

        // increment number of ads viewed for buyer.
        await userContract.methods.incrementNumAdsViewed(buyerAddress).send({ from: accounts[0] })   

        // increment number of ads viewed for seller.
        await sellContract.methods.incrementNumAdsViewed(sellerAddress).send({ from: accounts[0] })   
    }

    handleFieldChange = () =>
    {
        this.setState({ isModalOpen: false });
    }

    handleChange2(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value
        });
    }



    
  render () {
    if(this.state.ranked == true)
    {
        return (
        <Layout>

            <Modal isOpen={this.state.modal2Show} toggle={this.modal2Show} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Purchase Receipt</ModalHeader>
                <ModalBody id = "modalBody">
                    <ul>
                        <li><b>Company Name: </b>{this.state.info.companyName}</li>
                        <li><b>CPT recieved: </b>{this.state.CPT}</li>
                        <li><b>Unencrypted contact Number: </b>{this.state.mobileNumber}</li>
                        <li><b>Encrypted Contact Number Sent to Seller: </b>{this.state.messageHash}</li>
                        <li><b>Website: </b> <a href={this.state.info.website}>{this.state.info.website}</a></li>
                    </ul>
                </ModalBody>
                <ModalFooter>
                    <Button type = "submit" color="primary" onClick={this.exit}>
                        Exit
                    </Button>
                </ModalFooter>
            </Modal>
        
            <Modal isOpen={this.state.modal3Show}>
            <ModalHeader>Please enter your mobile phone number to send to seller:</ModalHeader>
                <ModalBody id = "modalBody">
                <Form className="form">
                    <Col>
                        <FormGroup>
                            <Label>Mobile Number</Label>
                            <Input
                            type="text"
                            name="mobileNumber"
                            id="mobileNumber"
                            value = {this.state.mobileNumber}
                            onChange={this.handleChange2}
                            />
                        </FormGroup>
                    </Col>
                </Form>
                </ModalBody>
                <ModalFooter>
                    <Button type = "submit" color="primary" onClick={this.completePurchase}>
                    Submit
                </Button>
          </ModalFooter>
            </Modal>
        
            

            
                <ModalExample
                isOpen={this.state.isModalOpen}
                toggle={this.toggle}
                info = {this.state.info}
                onChange={this.handleFieldChange}
                purchaseAd = {this.purchaseAd}
                address = {this.state.specificAddress}
                />

            {
                this.state.sellerData.map((advertiser) =>
                {
                    return (
                        <Entry
                        purchaseAd = {this.purchaseAd}
                        getMoreInfo = {this.getMoreInfo}
                        key = {advertiser.name}
                        advertiser = {advertiser}
                        />
                    )
                }
            )}
        </Layout>
        )
    }
    else
    {
        return(<div></div>)
    }

  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, ttContract, uContract, sellContract, logContract }) => (
      <Seller
        accounts={accounts} 
        sellContract={sellContract} 
        tokenContract={ttContract} 
        userContract={uContract} 
        web3={web3}
        logContract = {logContract}
      />
    )}
  />
)
