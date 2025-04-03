import { PublicKey, Connection, VersionedTransaction } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";

dotenv.config();

const connection = new Connection(
  `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
  "confirmed"
);


interface TriggerOrder {
    userPubkey: string;
    orderKey: string;
    inputMint: string;
    outputMint: string;
    makingAmount: string;
    takingAmount: string;
    remainingMakingAmount: string;
    remainingTakingAmount: string;
    status: string;
    [key: string]: any;
  }
  
  interface GetTriggerOrdersResponse {
    orders: TriggerOrder[];
    totalPages: number;
    page: number;
    user: string;
    orderStatus: string;
  }
  
  interface CancelOrderResponse {
    transaction: string;
    requestId: string;
  }
  
  interface CancelOrdersResponse {
    transactions: string[];
    requestId: string;
  }
  
  interface ExecuteCancelOrderResponse {
    signature?: string;
    status: "Success" | "Failed";
    error?: string;
    code?: number;
  }
  
  class TriggerApiClient {
    private readonly baseUrl: string = "https://api.jup.ag/trigger/v1";
  
    // Get trigger orders
    async getTriggerOrders(
      userAddress: string,
      orderStatus: "active" | "history" = "active",
      page: number = 1
    ): Promise<GetTriggerOrdersResponse> {
      try {
        const url = `${this.baseUrl}/getTriggerOrders?user=${userAddress}&orderStatus=${orderStatus}&page=${page}`;
  
        const response = await fetch(url);
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
  
        const data: GetTriggerOrdersResponse = await response.json();
        return data;
      } catch (error) {
        console.error("Error getting trigger orders:", error);
        throw error;
      }
    }
  
    // Cancel an order
    async cancelOrder(
      makerAddress: string,
      orderKey: string,
      computeUnitPrice: "auto" | number = "auto"
    ): Promise<CancelOrderResponse> {
      try {
        const requestBody = {
          maker: makerAddress,
          order: orderKey,
          computeUnitPrice,
        };
  
        const response = await fetch(`${this.baseUrl}/cancelOrder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
  
        const data: CancelOrderResponse = await response.json();
        return data;
      } catch (error) {
        console.error("Error cancelling order:", error);
        throw error;
      }
    }
  
    // Cancel multiple orders
    async cancelOrders(
      makerAddress: string,
      orderKeys: string[],
      computeUnitPrice: "auto" | number = "auto"
    ): Promise<CancelOrdersResponse> {
      try {
        const requestBody = {
          maker: makerAddress,
          orders: orderKeys,
          computeUnitPrice,
        };
  
        const response = await fetch(`${this.baseUrl}/cancelOrders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
  
        const data: CancelOrdersResponse = await response.json();
        return data;
      } catch (error) {
        console.error("Error cancelling multiple orders:", error);
        throw error;
      }
    }
  
    // Execute order cancellation
    async executeCancelOrder(
      signedTransaction: string,
      requestId?: string
    ): Promise<ExecuteCancelOrderResponse> {
      try {
        const requestBody: any = {
          signedTransaction,
        };
  
        if (requestId) {
          requestBody.requestId = requestId;
        }
  
        const response = await fetch(`${this.baseUrl}/execute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
  
        const data: ExecuteCancelOrderResponse = await response.json();
        return data;
      } catch (error) {
        console.error("Error executing order cancellations:", error);
        throw error;
      }
    }
  }
