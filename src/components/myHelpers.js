
export const ether = n => {
  return new window.web3.utils.BN(
    window.web3.utils.toWei(n.toString(), 'ether')
  )
}

export const fromWei = n => {
  return new window.web3.utils.BN(
    window.web3.utils.fromWei(n.toString(), 'ether')
  )
}

// Same as ether
export const tokens = n => ether(n)

export const wait = s => {
  const milliseconds = s * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const shortenAddress = (address) => {
  return address.substr(0, 6) + '\u2026' + address.substr(address.length-4, 4);
}