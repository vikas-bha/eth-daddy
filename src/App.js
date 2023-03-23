import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Search from './components/Search'
import Domain from './components/Domain'

// ABIs
import ETHDaddy from './abis/ETHDaddy.json'

// Config
import config from './config.json';
// account 7 is connected to this project in my metamask
function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ethDaddy, setETHDaddy] = useState(null);
  const [domains, setDomains] = useState([])


  





  const loadBlockChainData =async ()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork();
    console.log(network);

    const ethDaddy = new ethers.Contract(config[network.chainId].ETHDaddy.address, ETHDaddy, provider)
    console.log(ethDaddy);
    setETHDaddy(ethDaddy);

    const maxSupply = await ethDaddy.maxSupply();
    console.log(maxSupply.toString());

    const domains = []

    for (var i = 1; i <= maxSupply; i++) {
      const domain = await ethDaddy.getDomain(i)
      domains.push(domain)
    }
    console.log(domains);

    setDomains(domains)



    // if the user changes the account in metamask 
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
  }

  useEffect(()=>{
    loadBlockChainData();
  },[]);

  return (
    <div>
        <Navigation account={account} setAccount={setAccount} />
        <Search/>
      <div className='cards__section'>

        <h2 className='cards__title'>Why you need to have a domain name.</h2>
       
      <p className='cards__description'> Own your custom username, use it across services, and
          be able to store an avatar and other profile data.</p>

        <hr/>

        <div className='cards'>
          {domains.map((domain, index) => (
            // <p key={index}>{domain.name}</p>
            <Domain domain={domain} ethDaddy={ethDaddy} provider={provider} id={index+1} key={index} />
          )

          )}
        </div>
    
      </div>

    </div>
  );
}

export default App;