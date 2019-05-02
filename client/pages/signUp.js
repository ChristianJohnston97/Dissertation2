import React, { Component } from 'react';
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Layout from '../components/myLayout'
import Router from 'next/router'

//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer
const IPFS = require('ipfs-http-client');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });



import {
  Container, Col, Form,
  FormGroup, Label, CustomInput, Input,
  Button, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import '../components/form.css'


import '../components/signup.css'

import ModalExample from './modal.js'


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          firstName: "",
          secondName: "",
          email: "",
          age: "",
          address: props.accounts[0],
          ipfsHash: null,
          buffer: '',
          modalShow: false,
          modal2Show: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggle2 = this.toggle2.bind(this);

    }

    toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }

      toggle2() {
        this.setState({
            modal2Show: !this.state.modal2Show
        });
      }

    // checks to see if these user alread exists, if so, the fields are populated
    componentDidMount = async (event) => 
    {
        const { accounts, contract, logContract} = this.props

        // gets the address of the logged-in account
        const address = await logContract.methods.getAddress().call()

        this.setState({address: address})

        //const result = await contract.methods.doesUserExist(accounts[0]).call()
        const result = await contract.methods.doesUserExist(address).call()
        if(result == true)
        {
            var userData = await contract.methods.getUserInfo(address).call();
            var firstName = userData.firstName
            var secondName = userData.secondName
            var email = userData.email
            var age = userData.age
            this.setState({firstName: firstName})
            this.setState({secondName: secondName})
            this.setState({email: email})
            this.setState({age: age})
        }
    }

    captureFile =(event) => 
    {
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => 
        {
            this.setState({buffer: Buffer.from(reader.result)});
        }  
    };

    onSubmit = async (event) => 
    {
        event.preventDefault();
    }; 


    handleChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value
        });
    }

    fileChangedHandler = (event) => {
        this.setState({selectedFile: event.target.files[0]})
      }

    // store the user and then redirect to search window 
    handleSubmit = async (event) => 
    {
        event.preventDefault();
        const { accounts, uContract, logContract, iContract  } = this.props
        //save document to IPFS, return its hash, and set hash to state

        // if user has selcted a photo
        if(this.state.buffer != "")
        {
            let result = await ipfs.add(this.state.buffer)
            this.setState({ ipfsHash: result[0].hash});
        
            //send IPFS hash to etheruem contract 
            await iContract.methods.sendHash(result[0].hash).send({from: accounts[0]});
        }
        // toggle message hash modal
        this.toggle2()
        
        await this.storeUser();
    }
    
    routeToProfile = async () => 
    {
        Router.push('/myProfile')
    }
    

    storeUser = async () => {
            const { accounts, contract } = this.props
            var counter = 0;
            var firstName;
            var secondName;
            var email;
            var age;
            var address = this.state.address;

            // how much information the user has provided 
            if(this.state.firstName != "")
            {
                counter++;
                firstName = String(this.state.firstName);
            }
            else
            {
                firstName = "";
            }
            if(this.state.secondName != "")
            {
                counter++;
                secondName = String(this.state.secondName);
            }
            else
            {
                secondName = "";
            }
            if(this.state.email != "")
            {
                counter++;
                email = String(this.state.email);
            }
            else
            {
                email = "";
            }
            if(this.state.age != "")
            {
                counter++;
                age = String(this.state.age);
            }
            else
            {
                age = 0;
            }
            if(this.state.buffer != "")
            {
                counter++;
            }

            var numberOfVariables = 5;

            // score is the amount of data committed to the system (out of 5)
            var score = Math.ceil((counter/numberOfVariables)*5);

            await contract.methods.createUser(address, firstName, secondName, email, age, score).send({ from: accounts[0], gas: 800000})
    };


  render() {
    return (
      <Layout className="App">
      <br></br>
      <div id  = "flex">
      <h2>Buyer Sign Up   </h2>
      <ModalExample 
            buttonLabel = {"?"}
            content = {   
                <ul>
                    <li>Full control over data committed to system</li>
                    <li>Data committed is permanent and immutable</li>
                    <li>All data committed is made public on the blockchain</li>
                </ul>
            }
            title = {"Data Commitment"}
            />

      </div>
        
        <Form className="form" onSubmit={this.handleSubmit}>
          <Col>
            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                name="firstName"
                id="exampleEmail"
                value = {this.state.firstName}
                onChange={this.handleChange}
                placeholder="Joe"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Second Name</Label>
              <Input
                type="text"
                name="secondName"
                id="secondName"
                value = {this.state.secondName}
                onChange={this.handleChange}
                placeholder="Blogs"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value = {this.state.email}
                onChange={this.handleChange}
                placeholder="joe.blogs@email.com"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Age</Label>
              <Input
                type="text"
                name="age"
                id="age"
                placeholder="18"
                value = {this.state.age}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Address</Label>
              <Input
                type="text"
                readOnly
                name="age"
                value = {this.state.address}
                onChange={this.handleChange}

                id="age"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
            <Label>Choose profile picture</Label>

          <Input 
                type = "file"
                onChange = {this.captureFile}
            />
             </FormGroup>
          </Col>

          <br></br>
          <Button color="primary"  onClick={this.toggle}>Submit</Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Data Commit Confirmation</ModalHeader>
            <ModalBody>
                Please confirm that you would like to submit the form data to the blockchain.
                This is an irreversible operation and the data is immutable.
            </ModalBody>
            <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Go back
            </Button>
            <Button type = "submit" color="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
            </Modal>
        

            <Modal isOpen={this.state.modal2Show} toggle={this.toggle2}>
            <ModalHeader>IPFS</ModalHeader>
            <ModalBody>
                <b>Content Addressable Storage System Photo Hash: </b>
                <br/>
                {this.state.ipfsHash}
            </ModalBody>
            <ModalFooter>
            <Button type = "submit" color="primary" onClick={this.routeToProfile}>
              Exit
            </Button>
          </ModalFooter>
            </Modal>

        </Form>
      </Layout>
    );
  }
}

export default () => (
    <Web3Container
      renderLoading={() => <div>Loading Login Page...</div>}
      render={({ web3, accounts, uContract, logContract, iContract}) => (
        <Login 
          accounts={accounts} 
          contract={uContract} 
          web3={web3} 
          logContract = {logContract}
          iContract = {iContract}
        />
      )}
    />
  )
  
  