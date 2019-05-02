import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Router from 'next/router'
import {UncontrolledAlert, Button, Alert, Row, Col, Form, FormGroup, Label, Input, FormText  } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

var Wallet = require('ethereumjs-wallet');
var EthUtil = require('ethereumjs-util');

// React captcha
import ReCAPTCHA from "react-google-recaptcha";

//components
import Layout from '../components/myLayout'

import ModalExample from './modal.js'

import '../components/index.css'


var captchaSolved = true;

// when the CAPTCHA is solved
function handleCAPTCHA() 
{
    captchaSolved = true;
}

// this is to initialise the pre-defined seller data
var initialised = false


class Index extends React.Component {
    constructor(props) 
    {
        super(props);

        this.state = {
            address: props.accounts[0],
            signedUp: false,
            initialised: false,
            sellerSignedUp: false,
            providedAddress: '',
            permanentAddress: '',
            verified: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount = async () => 
    {
        await this.initialised()
        const { accounts, uContract, logContract  } = this.props
        var _address = await logContract.methods.getAddress().call()
        if (_address != "0x0000000000000000000000000000000000000000")
        {
            this.setState({permanentAddress: _address})
            this.userExists()
            this.sellerExists()
        }

    }    

    // reads in JSON and adds seller data to Sellers contract
    initialiseSellerData = async () => 
    {
        const { web3, accounts, sellContract, tokenContract  } = this.props
    
        var data = require('./sellerData.json');

        // for each advertiser in the JSON file 
        var j = 1;
        for (var i in data) 
        {
            var info = data[i]
            var name = String(info.name)
            var companyName = String(info.companyName)
            var pricePerHour = parseInt(info.pricePerHour);
            var yearsExperience = parseInt(info.yearsExperience);
            var specialisation = String(info.specialisation)
            var summary = String(info.summary)
            var address = accounts[j++];


            // get the photo path as a string
            var photo = String(info.photo)

            // website for each seller
            var website = String(info.website)

            var numAdsViewed = parseInt(info.numAdsViewed)
            var numAdsPurchased = parseInt(info.numAdsPurchased)

            // numAdsViewed and numAds Purchased = 0
            // sets each seller to have 100 CPT tokens
            await sellContract.methods.createUser(address, name, companyName, yearsExperience, pricePerHour, specialisation, summary, numAdsViewed, numAdsPurchased, website, photo).send({ from: accounts[0], gas: 1300000}) 
        }
    }

    // see if user exists. i.e. already signed-up, if exists, set signed-up to true
    userExists = async () => 
    {
        const { accounts, uContract, logContract  } = this.props
        var _address = await logContract.methods.getAddress().call()
        const response = await uContract.methods.doesUserExist(_address).call()
        if(response == true)
        {
            this.setState({signedUp: true})
        }
    }

    initialised = async () => 
    {
        const { accounts,  sellContract } = this.props
        const response = await sellContract.methods.initialised().call()
        if(response != true)
        {
            await this.initialiseSellerData()     
        }
    }

    sellerExists = async () => 
    {
        const { accounts, sellContract, logContract } = this.props
        var _address = await logContract.methods.getAddress().call()
        const response = await sellContract.methods.doesUserExist(_address).call()
        if(response == true)
        {
            this.setState({sellerSignedUp: true})
        }
    }


    
    handleBuyerClick = async () => 
    {
        const { accounts, logContract} = this.props
        var _address = await logContract.methods.getAddress().call()
        this.userExists()
        if(_address != '0x0000000000000000000000000000000000000000')
        {
            if(this.state.verified)
            {
                if(this.state.signedUp)
                {
                    Router.push('/myProfile')
                }
                else
                {
                    Router.push('/signUp')
                }
            }
            else
            {
                window.alert("Not verified ")
            }
        }
        else
        {
            window.alert("Please login!")
        }
    }


    handleSellerClick = async () => 
    {
        const { accounts, logContract} = this.props
        var _address = await logContract.methods.getAddress().call()
        this.sellerExists()
        if(_address != '0x0000000000000000000000000000000000000000')
        {
            if(this.state.verified)
            {
                if(this.state.sellerSignedUp)
                {
                    Router.push('/sellerProfile')
                }
                else
                {
                    Router.push('/sellerSignUp')
                }
            }
            else
            {
                window.alert("Not verified ")
            }
        }
        else
        {
            window.alert("Please login!")
        }
        
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value
        });
    }


    // when the user clicks Login
    handleSubmit = async (event) => 
    {
        const {web3, accounts, logContract} = this.props
        event.preventDefault();

        if (captchaSolved == false)
        {
            this.setState({providedAddress: ''})
            window.alert("Please complete CAPTCHA");
        }
        else
        {
            if(EthUtil.isValidPrivate(EthUtil.toBuffer(this.state.providedAddress)))
            {        
                // derive ethereum address from private key
                const privateKeyBuffer = EthUtil.toBuffer(this.state.providedAddress);
                const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
                const address = wallet.getAddressString();
    
                // sets the current loggedIn ethereum account
                await logContract.methods.setAddress(address).send({ from: accounts[0]})
    
                // update
                this.setState(this.state);
    
                //clear the box
                this.setState({providedAddress: ''})
    
                this.setState({permanentAddress: address})
    
                this.userExists()
                this.sellerExists()
    
                this.verify()
            }
            else
            {
                this.setState({providedAddress: ''})
                window.alert("Please enter a valid Ethereum address");
            }
        }
    }

    verify = async () => {
        const {accounts, vContract, uContract, web3, logContract } = this.props
    
        // hash of message
        var testData = web3.utils.sha3("test")

        // ethereum address 
        var address = await logContract.methods.getAddress().call()
    
        // sign data using address
        var signature = await web3.eth.sign(testData,address)
        
        // remove the 0x
        signature = signature.slice(2)
        var r = `0x${signature.slice(0, 64)}`
        var s = `0x${signature.slice(64, 128)}`
        var v = web3.utils.toDecimal(signature.slice(128, 130))
        v = v+27

        // verify 
        const response = await vContract.methods.verify(testData, v, r, s).call({ from: accounts[0] })
        
        // test if equal
        if (response === address)
        {
            this.setState({ verified: true})
            await uContract.methods.setVerified(address).send({ from: accounts[0] })
        }
    };


    render () {
      return (
          
        <Layout>
          
        <div className = "intro"> 
        <h1>Decentralised Marketplace</h1>

    
        </div>
        <br></br>

        <div className = "captcha">
            <ReCAPTCHA
                sitekey="6LeSzXgUAAAAACeCTxN263j9kG5175cmr5b0RDaq"
                onChange={handleCAPTCHA}
            />
        </div>
        <br></br>

        
        <Form onSubmit={this.handleSubmit}>
            <Row form>
                <Col md={10}>
                    <FormGroup>
                        <Input 
                        type="text" 
                        name="providedAddress"
                        id="providedAddress"
                        placeholder="Private Key"
                        value={this.state.providedAddress} 
                        onChange={this.handleChange}
                        />
                    </FormGroup>
                </Col>
                <Col md={1}>
                    <Button id = "button" type = "submit">Login & Verify</Button>      
                </Col>
            </Row>  
        </Form>
        


        <div className = "buttons">
            <Button size="lg" onClick={this.handleBuyerClick}>Consumer</Button> {' '}
            <Button size="lg" onClick={this.handleSellerClick}>Advertiser</Button>  
        </div>
      
        </Layout>
       
      )
    }
}

  
  export default () => (
    <Web3Container
      renderLoading={() => <div>Loading Dapp Page...</div>}
      render={({ web3, accounts, uContract, sellContract, vContract, ttContract, logContract  }) => (
        <Index 
          accounts={accounts} 
          uContract={uContract} 
          web3={web3}
          tokenContract = {ttContract}
          sellContract = {sellContract}
          logContract = {logContract}
          vContract = {vContract}
        />
      )}
    />
  )

