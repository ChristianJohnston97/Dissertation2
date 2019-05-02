import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Layout from '../components/myLayout'
import Router from 'next/router'
import { Button, Table } from 'reactstrap';
import '../components/profile.css'
 


function handleSearchClick(event)
{
    Router.push('/search')
}

function edit(event)
{
    Router.push('/signUp')
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            tokenBalance: undefined,
            firstName: undefined,
            secondName: undefined,
            email: undefined,
            age: undefined,
            hash: ""
        };
    }
   


  getUserInfo = async () =>
  {
    const { accounts, userContract, logContract } = this.props

    // gets the address of the current logged in account
    var address = await logContract.methods.getAddress().call()

    var results = await userContract.methods.getUserInfo(address).call()
    var firstName = results[0];
    var secondName = results[1];
    var email = results[2];
    var age = results[3];

    this.setState({address: address})

    if(firstName == "")
    {
        this.setState({firstName: ""})
    }
    else
    {
        this.setState({firstName: firstName})
    }
    if(secondName == "")
    {
        this.setState({secondName: ""})
    }
    else
    {
        this.setState({secondName: secondName})
    }
    if(email == "")
    {
        this.setState({email: ""})
    }
    else
    {
        this.setState({email: email})
    }
    if(age == 0)
    {
        this.setState({age: ""})
    }
    else
    {
        this.setState({age: age})
    }
  }



  // what to run when component loads
  componentDidMount = async () =>
  {
    const { accounts, userContract, iContract } = this.props
    var hash = await iContract.methods.getHash().call()
    this.setState({hash: hash})
    this.getUserInfo()
  }

  render () {
    return (
      <Layout>
          <br></br>
          <h2>User Profile</h2>

          <div id = "profile">

          <Table borderless = "true">

          <tbody>
            <tr>
              <th scope="row">Fist Name: </th>
              <td>{this.state.firstName}</td>
            </tr>
            <tr>
              <th scope="row">Second Name: </th>
              <td>{this.state.secondName}</td>
            </tr>
            <tr>
              <th scope="row">Email: </th>
              <td>{this.state.email}</td>
            </tr>
            <tr>
              <th scope="row">Age: </th>
              <td>{this.state.age}</td>
            </tr>
          
          </tbody>
        </Table>
        <img id = "picture" 
            src = {`https://ipfs.io/ipfs/${this.state.hash}`} 
            alt="" 
            height="260" 
            width="200"/>
        </div>
        

        <br></br>
        <Button onClick={() => {handleSearchClick(event)}}>Search</Button>{' '}
        <Button onClick={() => {edit(event)}}>Edit</Button> 
      </Layout>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, ttContract, uContract, logContract, iContract }) => (
      <Profile 
        accounts={accounts} 
        tokenContract={ttContract} 
        userContract={uContract} 
        web3={web3}
        logContract = {logContract}
        iContract = {iContract}
      />
    )}
  />
)
