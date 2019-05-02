import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Layout from '../components/myLayout'
import Router from 'next/router'

import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button, Table
  } from 'reactstrap';

function edit(event)
{
    Router.push('/sellerSignUp')
}


class SellerProfile extends React.Component {
    constructor(props) {
        super(props);        
        this.state = {
            tokenBalance: undefined,
            name: undefined,
            companyName: undefined,
            pricePerHour: undefined,
            yearsExperience: undefined,
            specialisation: undefined,
            summary: undefined,
            address: undefined
        };
    }


  getSellerInfo = async () =>
  {
    const { accounts, sellContract, logContract } = this.props

    // gets the address of the logged-in account
    var address = await logContract.methods.getAddress().call()

    var results = await sellContract.methods.getSellerInfo(address).call()
    var name = results[0]
    var companyName = results[1]
    var yearsExperience = results[2]
    var pricePerHour = results[3]
    var specialisation = results[4]
    var summary = results[5]

    if(this._mounted)
    {
        this.setState({name: name})
        this.setState({companyName: companyName})
        this.setState({pricePerHour: pricePerHour})
        this.setState({yearsExperience: yearsExperience})
        this.setState({specialisation: specialisation})
        this.setState({summary: summary})
        this.setState({address: address})
    }
  
  }

  buyTokens = async () => 
  {
    const { accounts, ttContract, logContract } = this.props
    var address = await logContract.methods.getAddress().call()
    // increase balance by 100
    await ttContract.methods.increaseBalance(address, 100).send({ from: accounts[0] }) 
  }

  componentDidMount = async () => 
  {
    this._mounted = true
    this.getSellerInfo()
  }

  componentWillUnmount () 
  {
    this._mounted = false
  }

  restrictions() 
  {
    Router.push('/sellerRestrictions')
  }

  pastBuyers() 
  {
    Router.push('/pastPurchases')
  }
 

  render () {
    return (
      <Layout>
        <br></br>
        <h2>Seller Profile</h2>
        <Table>

          <tbody>

            <tr>
              <th scope="row">Address: </th>
              <td>{this.state.address}</td>
            </tr>
            <tr>
              <th scope="row"> Name: </th>
              <td>{this.state.name}</td>
            </tr>
            <tr>
              <th scope="row">Company Name: </th>
              <td>{this.state.companyName}</td>
            </tr>
            <tr>
              <th scope="row">Price Per Hour: </th>
              <td>{this.state.pricePerHour}</td>
            </tr>
            <tr>
              <th scope="row">Years Experience: </th>
              <td>{this.state.yearsExperience}</td>
            </tr>
            <tr>
              <th scope="row">Specialisation: </th>
              <td>{this.state.specialisation}</td>
            </tr>
            <tr>
              <th scope="row">Summary: </th>
              <td>{this.state.summary}</td>
            </tr>
          </tbody>
        </Table>

        <Button onClick={this.buyTokens}>Buy 100CPT Tokens</Button>{' '}
        <Button onClick={() => {edit(event)}}>Edit</Button> 
        <Button onClick={this.restrictions}>Impose buyer restrictions</Button> 
        <Button onClick={this.pastBuyers}>See Past Buyers</Button> 

        <br></br>
      </Layout>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, ttContract, sellContract, logContract }) => (
      <SellerProfile 
        accounts={accounts} 
        ttContract={ttContract} 
        sellContract={sellContract} 
        web3={web3}
        logContract = {logContract}
      />
    )}
  />
)

