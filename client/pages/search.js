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

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
          maxPrice: "",
          minYearsExperience: "",
          specialisation: "",
          address: props.accounts[0]
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
        await this.search();
        Router.push('/seller')
    }

    search = async () => 
        {
            const { accounts, sellContract } = this.props

            var maxPrice = parseInt(this.state.maxPrice)
            var minYearsExperience = parseInt(this.state.minYearsExperience)
            var specialisation = String(this.state.specialisation)

            // contract call- set search paramaters
            await sellContract.methods.setSearchParams(maxPrice, minYearsExperience, specialisation).send({ from: accounts[0] })
        };


  render() {
    return (
      <Layout className="App">
        <Form className="form" onSubmit={this.handleSubmit}>
        <h2>Search</h2>
        <Col>
            <FormGroup>
                <Label>Specialisation</Label>
                <Input 
                type="select" 
                name="specialisation" 
                id="specialisation"
                value = {this.state.specialisation}
                onChange={this.handleChange}>
                    <option>Please select...</option>
                    <option>Any</option>
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
              <Label>Max Price (£/h)</Label>
              <Input
                type="text"
                name="maxPrice"
                id="maxPrice"
                value = {this.state.maxPrice}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Min Years Experience</Label>
              <Input
                type="text"
                name="minYearsExperience"
                id="minYearsExperience"
                value = {this.state.minYearsExperience}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>

            <br></br>
          <Button type = "submit">Submit</Button>{' '}
        </Form>
      </Layout>
    );
  }
}

export default () => (
    <Web3Container
      renderLoading={() => <div>Loading Login Page...</div>}
      render={({ web3, accounts, sellContract, uContract }) => (
        <Search 
          accounts={accounts} 
          sellContract={sellContract} 
          userContract={uContract} 
          web3={web3} 
        />
      )}
    />
  )