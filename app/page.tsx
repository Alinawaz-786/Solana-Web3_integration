"use client"

import { useState } from 'react';
import { Keypair } from "@solana/web3.js";
import Operation from "./api/operation";
import styles from './Calculator.module.css';
import { useAnchorWallet } from "@solana/wallet-adapter-react";


export default function Home() {

  const [display, setDisplay] = useState('');
  const [messageAccount, _] = useState(Keypair.generate());
  const [inputtedMessage, setInputtedMessage] = useState("");
  const wallet = useAnchorWallet();
  const handleButtonClick = (value: any) => {
    if (value === '=') {
      try {
        setDisplay(eval(display).toString());
        Operation(
          display,
          wallet,
          messageAccount
        )
      } catch {
        setDisplay('Error');
      }
    } else if (value === 'C') {
      setDisplay('');
    } else {
      setDisplay(display + value);
    }
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.display}>{display}</div>
      <div className={styles.buttons}>
        {['7', '8', '9', '/'].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['4', '5', '6', '*'].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['1', '2', '3', '-'].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['0', '.', '=', '+'].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))} 
        <button onClick={() => handleButtonClick('C')}>C</button>
      </div>
    </div>
  );


}
