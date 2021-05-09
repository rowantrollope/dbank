import { tokens, ether, fromWei, shortenAddress } from './myHelpers' 
import { Card } from 'react-bootstrap'

const AccountCard = ({ account, walletBalance_ETH, walletBalance_DBC, isDeposited, isBorrowed }) => {

    return (
        <Card border="primary">
        <Card.Header as="h5">User Account<br/></Card.Header>
        <Card.Body>
          <Card.Text >
            Account Number: { shortenAddress(account) }<br/><br/>
            ETH Balance: { window.web3.utils.fromWei(walletBalance_ETH, 'Ether') } <br/>
            DBC Balance: { window.web3.utils.fromWei(walletBalance_DBC, 'Ether') } <br/>
            Has Staked: { isDeposited ? "Yes" : "No" } <br/>
            Has Borrowed: { isBorrowed ? "Yes" : "No" } <br/>
          </Card.Text>
        </Card.Body>
      </Card>

    )

}
export default AccountCard