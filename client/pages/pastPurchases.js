import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Layout from '../components/myLayout'
import Router from 'next/router'
import { Modal, Card, Button, CardImg, CardTitle, CardText, Row, Col, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';

import '../components/pastPurchases.css'

class UserEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        <p>hello</p>
      return (
          
        <Col sm="6">
          <Card body>
            <CardTitle>{this.props.user.firstName} {this.props.user.secondName}</CardTitle>
            <CardImg id = "photo" src= {`https://ipfs.io/ipfs/${this.props.user.photo}`} />
            <CardText>Email: {this.props.user.email}</CardText>
            <CardText>Age: {this.props.user.age}</CardText>
            <CardText>Contact Number: {this.props.user.contactInfo}</CardText>
          </Card>
        </Col>
      );
    }
}

class Purchases extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pastPurchases: []
        };
    }
    componentDidMount = async () =>
    {
        const userInfo = await this.getUserInfo()
        this.setState({ pastPurchases: userInfo })
        //this.forceUpdate()
    }



    getUserInfo = async () =>
    {
      var userInfo = []
      const { accounts, sellContract, userContract, logContract, iContract} = this.props

      var _address = await logContract.methods.getAddress().call()


      const users = await sellContract.methods.getPastBuyers(_address).call()

      for (const address of users) 
      {
        const buyerInfo = await userContract.methods.getUserInfo(address).call()
        var contactInfo = await sellContract.methods.getMessage().call()
        var hash = await iContract.methods.getHash().call()
        
        var firstName = buyerInfo.firstName
        var secondName = buyerInfo.secondName
        var email = buyerInfo.email
        var age = buyerInfo.age
        var photo = hash

        var user = {
            firstName: firstName,
            secondName: secondName,
            email: email,
            age: age,
            contactInfo: contactInfo,
            photo: photo
        }
        userInfo.push(user)
      }
      return userInfo
    }

  render () {
    return (
      <Layout>
        {
            this.state.pastPurchases.map((user) =>
            {
                return(
                    <UserEntry
                    key = {user.firstName}
                    user = {user}
                />)
            }
        )}
      </Layout>
    )

  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, ttContract, uContract, sellContract, logContract, iContract}) => (
      <Purchases
        accounts={accounts} 
        sellContract={sellContract} 
        tokenContract={ttContract} 
        userContract={uContract} 
        web3={web3}
        logContract = {logContract}
        iContract = {iContract}
      />
    )}
  />
)
