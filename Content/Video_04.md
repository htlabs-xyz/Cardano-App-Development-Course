# Video 04:  Cardano interaction using libraries and sdk

---

**1. Onchain & Offchain**

- **Tổng quan về On-chain và Off-chain**
    - **On-chain:** Chương trình chạy trên blockchain, bao gồm **Validator Script**, **Smart Contract**, và cách chúng hoạt động trên Cardano (Plutus, Aiken).
    - **Off-chain:** Chạy trên ứng dụng bên ngoài blockchain, thực hiện logic giao dịch trước khi ký và gửi giao dịch lên mạng.
- **Các thư viện hỗ trợ tương tác Off-chain với Cardano**
    - **MeshJS:** Dễ sử dụng, cung cấp sẵn React components, hỗ trợ nhiều tính năng dApp.
    - **Cardano Serialization Library (CSL):** Cung cấp API thuần tuý để thao tác với dữ liệu Cardano ở mức thấp.
- **Các chức năng chính của các thư viện Off-chain phổ biến**
    - Kết nối ví
    - Xây dựng và ký giao dịch
    - Mint NFT và tokens
    - Staking và delegation
    - Tương tác với smart contract

---

### **2. MeshJS là gì?**

- **Giới thiệu chung:**
    - MeshJS là thư viện **mã nguồn mở**, viết bằng **TypeScript**, giúp dễ dàng xây dựng **dApp** trên Cardano.
    - Được thiết kế với mục tiêu đơn giản hóa quá trình phát triển ứng dụng Web3 trên Cardano.
- **Tài nguyên chính:**
    - [Trang chủ MeshJS](https://meshjs.dev/)
    - [GitHub](https://github.com/MeshJS/mesh)
    - [Discord Community](https://discord.gg/meshjs)
- **Các Module quan trọng trong MeshJS:**
    - **Wallets:**
        - APIs giúp kết nối và tương tác với ví Cardano.
        - Hỗ trợ các ví phổ biến như **Nami, Eternl, Flint, Typhon**.
    - **Transaction Builder:**
        - Xây dựng giao dịch bằng API tương tự **cardano-cli**.
        - Cho phép tạo giao dịch gửi ADA, gửi token, và giao dịch phức tạp hơn như script transactions.
    - **Transactions:**
        - API đơn giản hóa quá trình tạo giao dịch, ký và gửi giao dịch lên mạng.
        - Hỗ trợ **minting token, staking, delegate stake pools** và **tương tác với smart contract**.
    - **React Components:**
        - Các thành phần UI giúp tích hợp MeshJS với React dễ dàng hơn.
        - Một số components tiêu biểu: **CardanoWallet, MeshProvider**.
    - **Providers:**
        - Kết nối dApp với blockchain Cardano thông qua các nhà cung cấp dữ liệu.
        - Hỗ trợ **Blockfrost, Koios, Ogmios**.
    - **Utilities:**
        - Bộ công cụ giúp serialize/deserialize dữ liệu, chuyển đổi giữa các định dạng.
    - **Smart Contracts Lib:**
        - Cung cấp smart contracts mã nguồn mở, có tài liệu hướng dẫn và demo trực tiếp.

---

### **3. Cài đặt và sử dụng MeshJS**

- **Cài đặt bằng npm hoặc yarn:**
hoặc
    
    ```
    npm install @meshsdk/core
    ```
    
    ```
    yarn add @meshsdk/core
    ```
    
- **Cài đặt React UI Components:**
    
    ```bash
    npm install @meshsdk/react
    ```
    
- **Import và sử dụng MeshJS trong dự án React:**
    
    ```tsx
    import { MeshProvider, CardanoWallet } from '@meshsdk/react';
    
    function App() {
        return (
            <MeshProvider>
                <CardanoWallet />
            </MeshProvider>
        );
    }
    export default App;
    
    ```
    

---

### **4. Giới thiệu về module Wallet (Ví Cardano)**

- **Các chức năng chính của module Wallet:**
    - **Get Available Wallets** – Kiểm tra các ví có sẵn trên trình duyệt.
    - **Connect Wallet** – Kết nối dApp với ví Cardano.
    - **Get Balance** – Lấy số dư ADA và token trong ví.
    - **Sign Transaction** – Ký giao dịch trực tiếp trên ví.
    - **Send Transaction** – Gửi giao dịch đã ký lên blockchain.
- **Ví dụ: Kết nối ví và lấy số dư ADA**
    
    ```tsx
    import { useWallet } from '@meshsdk/react';
    
    function WalletInfo() {
        const { connected, connect, disconnect, getBalance } = useWallet();
    
        return (
            <div>
                {!connected ? (
                    <button onClick={connect}>Kết nối ví</button>
                ) : (
                    <>
                        <button onClick={disconnect}>Ngắt kết nối</button>
                        <button onClick={async () => alert(await getBalance())}>
                            Xem số dư
                        </button>
                    </>
                )}
            </div>
        );
    }
    
    ```
    

---

### **5. Giới thiệu về module Transaction (Giao dịch)**

- **Các chức năng chính của module Transaction:**
    - **Tạo giao dịch**
    - **Ký giao dịch**
    - **Gửi giao dịch**
    - **Mint assets (NFTs, Tokens)**
    - **Tương tác với smart contracts**
- **Ví dụ: Tạo giao dịch gửi ADA**
    
    ```tsx
    import { useWallet, Transaction } from '@meshsdk/react';
    
    function SendADA() {
        const { connected, wallet } = useWallet();
    
        const sendADA = async () => {
            if (!connected) return;
    
            const tx = new Transaction({ initiator: wallet })
                .sendLovelace(
                    'addr_test1qpz...', // Địa chỉ nhận
                    '1000000' // 1 ADA = 1,000,000 Lovelace
                )
                .build();
    
            const signedTx = await wallet.signTx(tx);
            const txHash = await wallet.submitTx(signedTx);
            console.log('Transaction Hash:', txHash);
        };
    
        return <button onClick={sendADA}>Gửi 1 ADA</button>;
    }
    
    ```
    

---

### **6. Giới thiệu về module React Components**

- **Các React components hữu ích trong MeshJS:**
    - **MeshProvider:** Cung cấp context cho toàn bộ ứng dụng.
    - **CardanoWallet:** Giao diện kết nối ví trực quan.
    - **Transaction Builder Components:** Hỗ trợ xây dựng giao dịch UI-friendly.
- **Ví dụ: Tích hợp `CardanoWallet` vào React App**
    
    ```tsx
    import { MeshProvider, CardanoWallet } from '@meshsdk/react';
    
    function App() {
        return (
            <MeshProvider>
                <CardanoWallet />
            </MeshProvider>
        );
    }
    
    export default App;
    ```
    
