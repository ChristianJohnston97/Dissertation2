import React, { Component } from 'react';
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Layout from '../components/myLayout'
import Router from 'next/router'


import {
  Container, Col, Form,
  FormGroup, Label, Input,
  Button,
} from 'reactstrap';

import '../components/form.css'

class SellerSignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: "",
          companyName: "",
          pricePerHour: "",
          yearsExperience: "",
          specialisation: "",
          summary: "",
          address: "",
          maxCPT: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount = async () => 
    {
        const { accounts, sellContract, logContract } = this.props
        
        // gets the address of the logged-in account
        const address = await logContract.methods.getAddress().call()

        const result = await sellContract.methods.doesUserExist(address).call()
        if(result == true)
        {
            var sellerData = await sellContract.methods.getSellerInfo(address).call();
            var name = sellerData.name
            var companyName = sellerData.companyName
            var yearsExperience = sellerData.numYearsExperience
            var pricePerHour = sellerData.pricePerHour
            var specialisation = sellerData.specialisation
            var summary = sellerData.summary
            this.setState({name: name})
            this.setState({companyName: companyName})
            this.setState({yearsExperience: yearsExperience})
            this.setState({pricePerHour: pricePerHour})
            this.setState({specialisation: specialisation})
            this.setState({summary: summary})
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

    handleSubmit = async (event) =>
    {
        event.preventDefault();
        await this.storeUser();
        Router.push('/sellerProfile')
    }

    storeUser = async () => 
    {
            const { accounts, sellContract, logContract } = this.props
            // gets the address of the logged-in account
            var address = await logContract.methods.getAddress().call()
            var name = String(this.state.name)
            var companyName = String(this.state.companyName)
            var yearsExperience = parseInt(this.state.yearsExperience)
            var pricePerHour = parseInt(this.state.pricePerHour)
            var specialisation = String(this.state.specialisation)
            var summary = String(this.state.summary)
            await sellContract.methods.createUser(address, name, companyName, yearsExperience, pricePerHour, specialisation, summary, 0, 0).send({ from: accounts[0], gas: 800000 })
    };


  render() {
    return (
      <Layout className="App">
      <br></br>
        <h2>Sign Up</h2>
        <Form className="form" onSubmit={this.handleSubmit}>
          <Col>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={this.state.name}
                onChange={this.handleChange}
                placeholder="Joe Bloggs"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="companyName"
                id="companyName"
                value={this.state.companyName}
                onChange={this.handleChange}
                placeholder="Google"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Price/h</Label>
              <Input
                type="text"
                name="pricePerHour"
                id="pricePerHour"
                value={this.state.pricePerHour}
                onChange={this.handleChange}
                placeholder="£100"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Years Experience</Label>
              <Input
                type="text"
                name="yearsExperience"
                id="yearsExperience"
                value={this.state.yearsExperience}
                onChange={this.handleChange}
                placeholder="5"
              />
            </FormGroup>
          </Col>
          <Col>
          <FormGroup>
                <Label>Specialisation</Label>
                <Input 
                type="select" 
                name="specialisation" 
                id="specialisation"
                value = {this.state.specialisation}
                onChange={this.handleChange}>
                    <option>Retail Banking</option>
                    <option>Corporate Finance</option>
                    <option>Investment Banking</option>
                    <option>Fund Management</option>
                    <option>Trading Brokers</option>
                    <option>Insurance</option>
                    <option>Accountants</option>
                </Input>
            </FormGroup>
            </Col>
          <Col>
            <FormGroup>
              <Label>Summary</Label>
              <Input
                type="textarea"
                name="summary"
                id="pricePerHour"
                value={this.state.summary}
                onChange={this.handleChange}
                placeholder="Small company in California"
              />
            </FormGroup>
          </Col>
          
          
          
          <Button type = "submit">Submit</Button>{' '}

        </Form>
      </Layout>
    );
  }
}

export default () => (
    <Web3Container
      renderLoading={() => <div>Loading Login Page...</div>}
      render={({ web3, accounts, uContract, sellContract, logContract}) => (
        <SellerSignUp 
          accounts={accounts} 
          contract={uContract} 
          sellContract = {sellContract}
          web3={web3}
          logContract = {logContract}

        />
      )}
    />
  )
  
  