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

class SellerRestrictions extends Component {
    constructor(props) {
        super(props);
        this.state = {
          minAgeOfBuyer: "",
          minNumberOfInteractions: "",
          minNumAdsPurchased: "",
          minScore: "",
          providedEmailAddress: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount = async () => 
    {
        const { accounts, sellContract, logContract } = this.props
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
        await this.savePreferences();
        Router.push('/sellerProfile')
    }

    savePreferences = async () => 
    {
            const { accounts, sellContract } = this.props        
            var minAgeOfBuyer = parseInt(this.state.minAgeOfBuyer)
            var minNumberOfInteractions = parseInt(this.state.minNumberOfInteractions)
            var minNumAdsPurchased = parseInt(this.state.minNumAdsPurchased)
            var providedEmailAddress = String(this.state.providedEmailAddress)
            var minScore = parseInt(this.state.minScore)
            await sellContract.methods.setSellerParamaters(providedEmailAddress, minAgeOfBuyer, minNumberOfInteractions, minNumAdsPurchased, minScore).send({ from: accounts[0], gas: 800000 })
    };


  render() {
    return (
      <Layout className="App">
      <br></br>
        <h2>Set Preferences</h2>
        <Form className="form" onSubmit={this.handleSubmit}>
          <Col>
            <FormGroup>
              <Label>Min Age of Buyer</Label>
              <Input
                type="text"
                name="minAgeOfBuyer"
                id="minAgeOfBuyer"
                value={this.state.minAgeOfBuyer}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Minimum Number of Buyer Interactions </Label>
              <Input
                type="text"
                name="minNumberOfInteractions"
                id="minNumberOfInteractions"
                value={this.state.minNumberOfInteractions}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Min Number of Ads Purchased</Label>
              <Input
                type="text"
                name="minNumAdsPurchased"
                id="minNumAdsPurchased"
                value={this.state.minNumAdsPurchased}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Minimum User Score</Label>
              <Input
                type="text"
                name="minScore"
                id="minScore"
                value={this.state.minScore}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>User must have provided contact information?</Label>
              <Input
                type="select"
                name="providedEmailAddress"
                id="providedEmailAddress"
                value={this.state.providedEmailAddress}
                onChange={this.handleChange}   
              >
              <option>Please Select</option>
              <option>Yes</option>
              <option>No</option>
              </Input>
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
        <SellerRestrictions 
          accounts={accounts} 
          contract={uContract} 
          sellContract = {sellContract}
          web3={web3}
          logContract = {logContract}

        />
      )}
    />
  )
  
  