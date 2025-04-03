"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useRouter } from "next/navigation";
import type React from "react"
import { useEffect } from "react";

export default function ConnectCard(){
  const wallet = useWallet();
  const router = useRouter();

  console.log("this is state of wallet:", wallet.connected)

  useEffect(() =>{
    if(wallet.connected){
      console.log("Wallet is connected")
      router.push("/dashboard")
    }else{
      console.log("Wallet is not connected")
    }
  }, [wallet.connected])

  return(
    <div className="bg-white/10 rounded-lg p-8 shadow-md backdrop-blur-sm border border-white/20 w-fit items-center justify-center gap-4 h-fit flex-col flex">
      <h2 className="text-lg font-semibold text-white">To Get Started, Connect Your Wallet</h2>
      <p className="text-sm text-gray-400">Connect your wallet to start using the app.</p>
      {/* Add wallet connection buttons here */}
        <WalletMultiButton />
    </div>
  )
}