import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Router from 'next/router'
import StarRatingComponent from 'react-star-rating-component';

//https://www.npmjs.com/package/react-star-rating-component

class Rating extends React.Component {
    constructor() {
        super();
        
        // set the default rating to 0
        this.state = {
          rating: 0
        };
    }

    componentDidUpdate = async (prevProps, prevState) => 
    {
        const { accounts, uContract, sellContract, logContract} = this.props

        var address = await logContract.methods.getAddress().call()
        if (address != "0x0000000000000000000000000000000000000000")
        {

            // if user is a buyer
            var isBuyer = await uContract.methods.doesUserExist(address).call()

            // if user is a seller 
            var isSeller = await sellContract.methods.doesUserExist(address).call()

        
            var score;
            // get the user transaction score
            if(isBuyer)
            {
                var numAdsViewed = await uContract.methods.getNumAdsViewed(address).call()
                var numAdsPurchased = await uContract.methods.getNumAdsPurchased(address).call()
                score = Math.ceil((numAdsPurchased/numAdsViewed)*5)
            }

            // get the seller transaction score
            else if(isSeller)
            {
                var numAdsViewed = await sellContract.methods.getNumAdsViewed(address).call()
                var numAdsPurchased = await sellContract.methods.getNumAdsPurchased(address).call()
                score = ((numAdsPurchased/ numAdsViewed)*5)
            }

            if(this._mounted) 
            {
                if(score != prevState.rating)
                {
                    this.setState({ rating: score })
                }
                else
                {
                    // DO NOTHING
                }
            }
        }
    }

    componentDidUpdate = async () => 
    {
        this.getRating()
    }
 
    componentDidMount = async () => 
    {
        this._mounted = true
        this.getRating()
    }
    componentWillUnmount () 
    {
        this._mounted = false
    }

    getRating = async () =>
    {
        const { accounts, uContract, sellContract, logContract} = this.props

        var address = await logContract.methods.getAddress().call()
        if (address != "0x0000000000000000000000000000000000000000")
        {

            // if user is a buyer
            var isBuyer = await uContract.methods.doesUserExist(address).call()

            // if user is a seller 
            var isSeller = await sellContract.methods.doesUserExist(address).call()

        
            var score;
            // get the user transaction score
            if(isBuyer)
            {
                var numAdsViewed = await uContract.methods.getNumAdsViewed(address).call()
                var numAdsPurchased = await uContract.methods.getNumAdsPurchased(address).call()
                score = ((numAdsPurchased/numAdsViewed)*5)
            }

            // get the seller transaction score
            else if(isSeller)
            {
                var numAdsViewed = await sellContract.methods.getNumAdsViewed(address).call()
                var numAdsPurchased = await sellContract.methods.getNumAdsPurchased(address).call()
                score = ((numAdsPurchased/ numAdsViewed)*5)
            }
            else
            {
                score = 0;
            }

            if(this._mounted) 
            {
                this.setState({ rating: score })
            }
        }
    }
  
    render() {    
        return (                
          <div>
            <StarRatingComponent 
              name="rate" 
              starCount={5}
              editing={false}
              value={this.state.rating}
            />
          </div>
        );
    }
}

  
  export default () => (
    <Web3Container
      renderLoading={() => <div>Loading Dapp Page...</div>}
      render={({ web3, accounts, uContract, sellContract, logContract }) => (
        <Rating 
          accounts={accounts} 
          web3={web3}
          uContract={uContract} 
          sellContract = {sellContract}
          logContract = {logContract}
        />
      )}
    />
  )

