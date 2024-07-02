import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import { Calculator } from "../../../../target/types/calculator";
import {
  connection,
  commitmentLevel,
  helloWorldprogramId,
  helloWorldprogramInterface,
} from "./utils/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export default async function Operation(
  inputtedMessage: string,
  wallet: AnchorWallet,
  messageAccount: web3.Keypair
) {

  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: commitmentLevel,
  });

  if (!provider) return;

  /* create the program interface combining the idl, program Id, and provider */
  const program = new Program(
    helloWorldprogramInterface,
    helloWorldprogramId,
    provider
  ) as Program<Calculator>;


  const regex = /(\d+)\s*([\+\-\*\/])\s*(\d+)/;
  const inputVal: any = inputtedMessage.match(regex);
  console.log(inputVal);

  try {
    const txn = await program.methods.initialize().accounts({
      calculator: messageAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    }).signers([messageAccount]).rpc()

    let txn1 = '';
    switch (inputVal[2]) {
      case '+':
        txn1 = await program.methods.add(new BN(inputVal[1]), new BN(inputVal[3])).accounts({
          calculator: messageAccount.publicKey,
        }).rpc()


        break;
      case '-':
        txn1 = await program.methods.subtract(new BN(inputVal[1]), new BN(inputVal[3])).accounts({
          calculator: messageAccount.publicKey,
        }).rpc()
        break;
      case '*':
        txn1 = await program.methods.multiply(new BN(inputVal[1]), new BN(inputVal[3])).accounts({
          calculator: messageAccount.publicKey,
        }).rpc()
        break;
      case '/':
        txn1 = await program.methods.divide(new BN(inputVal[1]), new BN(inputVal[3])).accounts({
          calculator: messageAccount.publicKey,
        }).rpc()
        break;
      default:
        break;
    }


    const account = await program.account.calculator.fetch(messageAccount.publicKey);
    console.log("Result: ", account.result.toString()); // 5

    console.log("messageAccount Data: ", txn1);
    return account;

  } catch (err) {
    console.log("Transaction error: ", err);
    return;
  }
}
