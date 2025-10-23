# Video 08: Introduction eUTxO model (datums, redeemers, etc.) & Aiken syntax

Bài viết này hướng dẫn cách hiểu mô hình **eUTxO** (Extended Unspent Transaction Output) trên blockchain Cardano, vai trò của **script**, **datum**, và **redeemer** trong hợp đồng thông minh, cùng với cách sử dụng ngôn ngữ **Aiken** để viết hợp đồng thông minh. Nội dung được thiết kế cho các nhà phát triển xây dựng ứng dụng phi tập trung (dApps) trên Cardano, cung cấp các khái niệm cốt lõi và hướng dẫn thực hành để triển khai hợp đồng thông minh đơn giản.

## Yêu Cầu Chuẩn Bị

Trước khi bắt đầu, hãy đảm bảo bạn có:

- **Node.js và npm**: Cài đặt Node.js (khuyến nghị phiên bản 16 trở lên) và npm để quản lý phụ thuộc JavaScript.
- **Trình Soạn Thảo Mã**: Sử dụng Visual Studio Code hoặc tương tự.
- **Aiken**: Cài đặt Aiken để viết hợp đồng thông minh (hướng dẫn chi tiết bên dưới).
- **Ví Cardano**: Thiết lập ví Cardano (như Eternl) với test ADA (tADA) trên mạng thử nghiệm Cardano testnet.
- **Kiến Thức Cơ Bản**: Hiểu biết về JavaScript, blockchain, và các khái niệm cơ bản về hợp đồng thông minh.

## Tổng Quan Về Mô Hình eUTxO

### Blockchain Cardano và Cấu Trúc Block
Blockchain Cardano được tổ chức thành các **block** (khối), mỗi block gồm hai phần chính:
1. **Header**: Chứa thông tin như mã hash của block hiện tại, mã hash của block trước (đảm bảo tính liên kết), và chi tiết block.
2. **Body**: Lưu trữ danh sách các **giao dịch** (transactions) xảy ra trong khoảng thời gian block được tạo.

### UTXO Là Gì?
**UTXO** (Unspent Transaction Output) là đầu ra chưa được chi tiêu của một giao dịch, đại diện cho tài sản mà một ví sở hữu. Ví dụ:
- Alice có 100 ADA từ một giao dịch trước (UTXO).
- Alice muốn chuyển 10 ADA cho Bob:
  - **Đầu vào**: UTXO 100 ADA của Alice.
  - **Đầu ra**: 10 ADA cho Bob và 90 ADA trả lại cho Alice.
  - Giao dịch tiêu thụ UTXO 100 ADA và tạo hai UTXO mới: 10 ADA (Bob) và 90 ADA (Alice).

Mỗi ví trên Cardano lưu trữ danh sách UTXO, và để thực hiện giao dịch, bạn phải sử dụng toàn bộ UTXO làm đầu vào, sau đó phân phối lại thành các UTXO mới.

### eUTxO Là Gì?
**eUTxO** (Extended UTXO) là phiên bản mở rộng của mô hình UTXO, được Cardano sử dụng để hỗ trợ hợp đồng thông minh. Điểm khác biệt chính:
- Ngoài ví người dùng, **hợp đồng thông minh** (smart contracts) cũng có thể sở hữu UTXO.
- UTXO trong hợp đồng thông minh được gắn với **datum** (dữ liệu) và được kiểm soát bởi **script** (logic hợp đồng).
- Để tiêu UTXO từ hợp đồng, giao dịch phải cung cấp **redeemer** và thỏa mãn logic của **script**.

### Địa Chỉ Trên Cardano
Địa chỉ Cardano bao gồm ba phần:
1. **Header**: Xác định loại địa chỉ (ví dụ: ví người dùng hoặc hợp đồng thông minh) và mạng (mainnet/testnet).
2. **Payment**: Liên kết với khóa công khai của ví hoặc script của hợp đồng thông minh.
3. **Delegation** (tùy chọn): Liên quan đến staking, không bắt buộc.

Ví dụ địa chỉ (Bech32): `addr_test1...`. Khi chuyển sang hex (Bech16), bạn có thể tách rõ các phần header, payment, và delegation.

### Script, Datum, và Redeemer
1. **Script**:
   - Là logic của hợp đồng thông minh, xác định điều kiện để tiêu UTXO.
   - Script hoạt động như một ví nhưng không có private key, thay vào đó sử dụng logic để xác thực giao dịch.
   - Ví dụ: Script yêu cầu chữ ký từ một ví cụ thể hoặc kiểm tra điều kiện logic.

2. **Datum**:
   - Là dữ liệu được gắn vào UTXO trong hợp đồng thông minh, lưu trữ thông tin như trạng thái hợp đồng (ví dụ: "ABC").
   - Datum được lưu on-chain và có thể truy vấn để đọc dữ liệu.

3. **Redeemer**:
   - Là dữ liệu được cung cấp trong giao dịch để tương tác với script.
   - Script sử dụng redeemer và datum để kiểm tra xem giao dịch có thỏa mãn logic hay không (trả về `true` hoặc `false`).

**Ví dụ**:
- Alice gửi 250 ADA vào một hợp đồng thông minh với datum "ABC".
- Để rút 250 ADA từ hợp đồng, Alice tạo giao dịch:
  - **Đầu vào**: UTXO 250 ADA từ hợp đồng.
  - **Redeemer**: Dữ liệu (ví dụ: "withdraw") để thỏa mãn logic script.
  - **Script**: Kiểm tra xem redeemer và datum có khớp với logic không (ví dụ: redeemer là "withdraw" và giao dịch được ký bởi Alice).
- Nếu logic trả về `true`, giao dịch được chấp nhận, và UTXO được chuyển về ví Alice.

### Ngữ Cảnh (Purposes) của eUTxO
Cardano hỗ trợ các ngữ cảnh chính cho eUTxO:
1. **Spend**: Tiêu UTXO từ ví hoặc hợp đồng để chuyển tài sản.
2. **Mint**: Tạo hoặc hủy tài sản (dùng policy ID và forging script).
3. **Vote/Proposal**: Quản trị on-chain (governance), như bỏ phiếu hoặc đề xuất.

## Sử Dụng Aiken Để Viết Hợp Đồng Thông Minh

**Aiken** là một ngôn ngữ lập trình được thiết kế để viết hợp đồng thông minh trên Cardano, cung cấp cú pháp đơn giản và hiệu quả hơn so với Haskell/Plutus. Dưới đây là hướng dẫn cài đặt Aiken và viết một hợp đồng "Hello World".

### Bước 1: Cài Đặt Aiken
1. **Cài Đặt Qua npm**:
   - Chạy lệnh sau để cài đặt Aiken (sử dụng `bun` thay `npm` nếu bạn dùng Bun):
     ```bash
     npm install -g @aiken-lang/aiken
     ```
   - Kiểm tra phiên bản:
     ```bash
     aiken --version
     ```
     Phiên bản mới nhất tại thời điểm viết là `1.0.19`.

2. **Tạo Dự Án Aiken**:
   - Tạo một dự án mới:
     ```bash
     aiken new hello-world
     cd hello-world
     ```
   - Cấu trúc dự án:
     - Thư mục `validators`: Chứa các file script hợp đồng thông minh.
     - File `aiken.toml`: Cấu hình dự án.

### Bước 2: Viết Hợp Đồng Hello World
Tạo một hợp đồng đơn giản kiểm tra xem giao dịch có được ký bởi một ví cụ thể và redeemer khớp với một giá trị nhất định.

1. Trong thư mục `validators`, tạo file `hello_world.ak`:
```aiken
validator {
  fn hello_world(datum: String, redeemer: String, ctx: ScriptContext) -> Bool {
    let owner = "HelloWorld" // Giá trị datum mong muốn
    let expected_redeemer = "HelloWorld" // Giá trị redeemer mong muốn
    let is_signed = ctx.tx.signatories.contains(ctx.script_address)

    datum == owner && redeemer == expected_redeemer && is_signed
  }
}
```

**Giải Thích Mã**:
- **Validator**: Định nghĩa logic hợp đồng thông minh.
- **Parameters**:
  - `datum: String`: Dữ liệu gắn với UTXO (ví dụ: "HelloWorld").
  - `redeemer: String`: Dữ liệu cung cấp trong giao dịch (ví dụ: "HelloWorld").
  - `ctx: ScriptContext`: Ngữ cảnh giao dịch, chứa thông tin như chữ ký và địa chỉ script.
- **Logic**:
  - Kiểm tra `datum` có khớp với "HelloWorld".
  - Kiểm tra `redeemer` có khớp với "HelloWorld".
  - Kiểm tra giao dịch có được ký bởi ví liên quan đến script (`ctx.tx.signatories.contains`).
- **Kết Quả**: Trả về `true` nếu tất cả điều kiện đều thỏa mãn, cho phép tiêu UTXO.

2. **Build Hợp Đồng**:
   - Chạy lệnh để biên dịch hợp đồng:
     ```bash
     aiken build
     ```
   - Kết quả tạo file `plutus.json` trong thư mục `build`, chứa mã hợp đồng đã biên dịch (CBOR format).
   - File này có thể được sử dụng với MeshJS để tích hợp vào dApp.

### Bước 3: Tích Hợp Hợp Đồng Với MeshJS
Để sử dụng hợp đồng trong một dự án Next.js, bạn cần tích hợp file `plutus.json` với MeshJS. Dưới đây là cách thực hiện giao dịch sử dụng hợp đồng:

1. **Tạo Trang Giao Dịch**:
   Tạo tệp `app/contract/page.jsx` để gọi hợp đồng:

```jsx
'use client';
import { useState, useEffect } from 'react';
import { Transaction, BrowserWallet } from '@meshsdk/core';
import WalletConnect from '../components/WalletConnect';

export default function Contract() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [datum, setDatum] = useState('HelloWorld');
  const [redeemer, setRedeemer] = useState('HelloWorld');

  useEffect(() => {
    const getBalance = async () => {
      if (wallet) {
        try {
          const balance = await wallet.getBalance();
          setBalance(balance.find(asset => asset.unit === 'lovelace').quantity / 1000000);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      } else {
        setBalance(0);
      }
    };
    getBalance();
  }, [wallet]);

  const lockFunds = async () => {
    if (!wallet) {
      alert('Please connect a wallet first.');
      return;
    }

    try {
      const addresses = await wallet.getUsedAddresses();
      const senderAddress = addresses[0];

      // Địa chỉ hợp đồng (lấy từ plutus.json hoặc tạo từ script)
      const scriptAddress = 'addr_test1...script_address...'; // Thay bằng địa chỉ script thực tế
      const tx = new Transaction({ initiator: wallet });
      tx.sendValue(
        { lovelace: '250000000' }, // 250 ADA
        scriptAddress,
        { datum: { value: datum, inline: true } } // Gắn datum
      );

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      alert(`Funds locked: ${txHash}`);
      console.log('Transaction Hash:', txHash);
    } catch (error) {
      console.error('Error locking funds:', error);
      alert('Failed to lock funds.');
    }
  };

  const unlockFunds = async () => {
    if (!wallet) {
      alert('Please connect a wallet first.');
      return;
    }

    try {
      const addresses = await wallet.getUsedAddresses();
      const senderAddress = addresses[0];
      const scriptAddress = 'addr_test1...script_address...'; // Thay bằng địa chỉ script thực tế

      // Lấy UTXO từ script (giả sử dùng Blockfrost)
      const projectId = 'preprodYourProjectIdHere'; // Thay bằng Project ID
      const response = await fetch(`https://cardano-preprod.blockfrost.io/api/v0/addresses/${scriptAddress}/utxos`, {
        headers: { project_id: projectId },
      });
      const utxos = await response.json();
      if (utxos.length === 0) {
        throw new Error('No UTXOs found in script');
      }

      const formattedUtxos = utxos.map(utxo => ({
        input: { outputIndex: utxo.output_index, txHash: utxo.tx_hash },
        output: {
          address: scriptAddress,
          amount: utxo.amount.map(asset => ({ unit: asset.unit, quantity: asset.quantity })),
          datum: utxo.data_hash ? { value: datum, inline: true } : undefined,
        },
      }));

      // Tạo giao dịch unlock
      const tx = new Transaction({ initiator: wallet });
      tx.setTxInputs(formattedUtxos);
      tx.sendValue({ lovelace: '250000000' }, senderAddress); // Gửi về ví người gửi
      tx.setRedeemer({ data: redeemer }); // Gắn redeemer
      tx.setScript({ code: 'script_code_from_plutus.json' }); // Thay bằng mã script từ plutus.json

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx, true);
      const txHash = await wallet.submitTx(signedTx);
      alert(`Funds unlocked: ${txHash}`);
      console.log('Transaction Hash:', txHash);
    } catch (error) {
      console.error('Error unlocking funds:', error);
      alert('Failed to unlock funds.');
    }
  };

  return (
    <main>
      <h1>Interact with Smart Contract</h1>
      <WalletConnect setWallet={setWallet} />
      <div>
        <h2>Lock Funds</h2>
        <button onClick={lockFunds}>Lock 250 ADA</button>
      </div>
      <div>
        <h2>Unlock Funds</h2>
        <button onClick={unlockFunds}>Unlock 250 ADA</button>
      </div>
      <p>Balance: {balance} ADA</p>
    </main>
  );
}
```

**Giải Thích Mã**:
- **Lock Funds**: Gửi 250 ADA vào hợp đồng với datum "HelloWorld".
- **Unlock Funds**:
  - Lấy UTXO từ địa chỉ hợp đồng qua Blockfrost.
  - Gắn redeemer "HelloWorld" và mã script từ `plutus.json`.
  - Gửi 250 ADA về ví người gửi nếu logic script trả về `true`.
- **Script Address**: Cần lấy từ `plutus.json` hoặc tạo từ Aiken (xem tài liệu Aiken để lấy địa chỉ script).

**Kiểm Tra Giao Dịch**:
- Chạy dự án: `npm run dev`.
- Truy cập `http://localhost:3000/contract`.
- Kết nối ví Eternl, nhấn "Lock 250 ADA" để gửi tiền vào hợp đồng, sau đó nhấn "Unlock 250 ADA" để rút.
- Kiểm tra hash giao dịch trên [Cardano Testnet Explorer](https://testnet.cardanoscan.io/).

## Tài Liệu Tham Khảo

- [Aiken Documentation](https://aiken-lang.org/): Hướng dẫn cài đặt và viết hợp đồng.
- [MeshJS Documentation](https://meshjs.dev/): Hướng dẫn tích hợp hợp đồng với dApp.
- [Blockfrost API Documentation](https://docs.blockfrost.io/): Endpoint để lấy UTXO.
- [Cardano Developer Portal](https://devs.cardano.org/): Công cụ và tài liệu phát triển Cardano.
- [Cardano Testnet Explorer](https://testnet.cardanoscan.io/): Kiểm tra giao dịch.

## Kết Luận

Bài viết đã giải thích mô hình **eUTxO** trên Cardano, vai trò của **script**, **datum**, và **redeemer**, cùng cách sử dụng **Aiken** để viết hợp đồng thông minh. Bạn đã học cách cài đặt Aiken, tạo hợp đồng "Hello World", và tích hợp với MeshJS để tương tác trong một dApp. Để mở rộng, bạn có thể viết các hợp đồng phức tạp hơn hoặc tích hợp với các ngữ cảnh như minting hoặc governance, tham khảo tài liệu Aiken và Cardano.
