import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Router from 'next/router'
import { Alert, Badge, Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';


class Balance extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tokenBalance: '',
            address: ''
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() 
    {
        var _addr = this.state.address
        window.alert("Logged in account: " + _addr);
    }

    componentDidUpdate = async (prevProps, prevState) => 
    {
        const { accounts, tokenContract, logContract } = this.props     
        var address = await logContract.methods.getAddress().call()
        this.setState({address: address})
        
        if (address != "0x0000000000000000000000000000000000000000")
        {
            const balance = await tokenContract.methods.balanceOf(address).call()

            if(balance != this.state.tokenBalance)
            {
                this.setState({ tokenBalance: balance })
            }
            else
            {
                // DO NOTHING
            }
        }
    }
 
    componentDidMount = async () => 
    {
        this._mounted = true
        this.getBalance()
    }
    componentWillUnmount () 
    {
        this._mounted = false
    }

    getBalance = async () =>
    {
        
        const { accounts, tokenContract, logContract } = this.props
        // this gets the address of the current logged in account/user
        var address = await logContract.methods.getAddress().call()
        if (address != "0x0000000000000000000000000000000000000000")
        {
            const balance = await tokenContract.methods.balanceOf(address).call()
            if(this._mounted) 
            {
                this.setState({ tokenBalance: balance })
            }
        } 
    }
  
    render () {
      return (
            <div id ="balance">
            <h4><Button onClick = {this.toggle} color="primary">{this.state.tokenBalance} CPT</Button></h4>
            </div>  
      )
    }
}

  
  export default () => (
    <Web3Container
      renderLoading={() => <div>Loading Dapp Page...</div>}
      render={({ web3, accounts, ttContract, logContract }) => (
        <Balance 
          accounts={accounts} 
          web3={web3}
          tokenContract = {ttContract}
          logContract = {logContract}
        />
      )}
    />
  )

