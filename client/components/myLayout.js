import Header from './header'

//import './layout.css'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

const Layout = (props) => (
  <div id = "layout" style={layoutStyle}>
    <Header />
    {props.children}
  </div>
)

export default Layout