import Link from 'next/link'
import Balance from './balance'
import Rating from './rating'
import './header.css'

// <Link href='/search'><a style={linkStyle}>Search</a></Link>
// <Link href='/myProfile'><a style={linkStyle}>User Profile</a></Link>
// <Link href='/sellerProfile'><a style={linkStyle}>Seller Profile</a></Link>
// <Link href='/seller'><a style={linkStyle}>Sellers</a></Link>
// <Link href='/pastPurchases'><a style={linkStyle}>Past Purchases</a></Link>

const Header = () => (
    <div id="wrapper">
        <div id = "home">
            <Link href="/">Home</Link>
        </div>
        <div id="balance">
            <Balance/>
        </div>
        <div id="rating">
            <Rating/>
        </div>
    </div>
)

export default Header