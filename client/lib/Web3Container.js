import React from 'react'
import getWeb3 from './getWeb3'
import getContract from './getContract'
import TutorialTokenContract from './contracts/TutorialToken.json'
import userContract from './contracts/Users.json'
import verifyContract from './contracts/Verify.json'
import sellerContract from './contracts/Sellers.json'
import logInContract from './contracts/LoggedIn.json'
import ipfsContract from './contracts/IPFS.json'

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, contract: null };

  async componentDidMount () {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const ttContract = await getContract(web3, TutorialTokenContract)
      const uContract = await getContract(web3, userContract)
      const vContract = await getContract(web3, verifyContract)
      const sellContract = await getContract(web3, sellerContract)
      const logContract = await getContract(web3, logInContract)
      const iContract = await getContract(web3, ipfsContract)

      this.setState({ web3, accounts, ttContract, uContract, vContract, sellContract, logContract, iContract})
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.log(error)
    }
  }

  render () {
    const { web3, accounts, ttContract, uContract, vContract, sellContract, logContract, iContract} = this.state
    return web3 && accounts
      ? this.props.render({ web3, accounts, ttContract, uContract, vContract, sellContract, logContract, iContract})
      : this.props.renderLoading()
  }
}
