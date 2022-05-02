import { ethers } from 'ethers';
import React, {useEffect, useState} from 'react';
import './App.css';
import Manager from "./artifacts/contracts/Manager.sol/Manager.json";

function App() {

  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [tickets, setTickets] = useState([]);

  const initConnection = async () => {
    if(typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setAccount(accounts[0]);
      setContract(
        new ethers.Contract(
          "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
          Manager.abi,
          signer
        )
      );
    }
    else {
      console.log("Please Install Metamask");
    }
  }

  useEffect(() => {
    initConnection();
  }, []);

  const getAllTickets = async () => {
    let result = await contract.getTickets();
    console.log(result);
    setTickets(result);
  };

  const createTicket = async (_name) => {
    let result = await contract.createTicket(_name);
    await result.wait();
    getAllTickets();
  }

  const updateStatus = async (_index, _status) => {
    const transaction = await contract.updateStatus(_index, _status);
    await transaction.wait();
    getAllTickets();
  }

  const renameTickets = async (_index) => {
    let newName = prompt("Please enter new ticket name", "");
    const transaction = await contract.updateTicketName(_index, newName);
    await transaction.wait();
    getAllTickets();
  }

  return (
    <div className='page'>
      <div className="header">
        <p>Task Manager</p>
        {account !== "" ? <p>{account.slice(0, 9)}</p> : <button className='big_button' onClick={initConnection}>Connect to App</button>}
      </div>
      <div className="input-section"></div>
      <div className="main">
        <div className="main_col" style={{backgroundColor: "blueviolet"}}>
          <div className="main_col_heading">Todo</div>
        </div>
        <div className="main_col" style={{backgroundColor: "gray"}}>
          <div className="main_col_heading">Busy</div>
        </div>
        <div className="main_col" style={{backgroundColor: "blanchedalmond"}}>
          <div className="main_col_heading">Done</div>
        </div>
      </div>
    </div>
  );
}

export default App;
