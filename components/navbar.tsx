"use client"

import { Button } from "@/components/ui/button"
import { Bot, Menu } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type React from "react" // Added import for React
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {

  const wallet = useWallet();
  const router = useRouter();

  useEffect(() => {
    if(wallet.connected){
      console.log("Wallet is connected")
    }else{
      router.push("/")
    }
  }, [wallet])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >

      <Link href="/" className="flex items-center space-x-2">
        <Bot className="w-8 h-8 text-purple-500" />
        <span className="text-white font-medium text-xl">GridAI</span>
      </Link>

      <div className="opacity-0">
        <WalletMultiButton />
      </div>

      {wallet.connected && <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/monitor">Monitoring</NavLink>
        <NavLink href="/learn">Learn More</NavLink>
      </div>}

      <Link href="/" className="flex items-center space-x-2 opacity-0">
        <Bot className="w-8 h-8 text-purple-500" />
        <span className="text-white font-medium text-xl">GridAI</span>
      </Link>

      <WalletMultiButton  />
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </Link>
  )
}

