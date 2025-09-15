# 📘 Video 6:  Cardano Transaction

## 📝 Bài tập 1: Tạo giao diện Form gửi ADA

### Đề bài
Tạo một giao diện form trong Next.js để nhập địa chỉ ví nhận và số lượng ADA cần gửi.

### Yêu cầu
- Tạo trang `/send` với form chứa hai input: địa chỉ ví nhận và số lượng ADA.
- Sử dụng state để quản lý dữ liệu nhập vào.
- Hiển thị thông báo lỗi nếu input trống khi nhấn nút gửi.
- Định dạng giao diện bằng CSS.

### Cách giải
1. **Tạo trang `/send`**:
   - Tạo file `app/send/page.tsx` để chứa form.
   - Sử dụng `useState` để quản lý địa chỉ ví nhận và số lượng ADA.
2. **Xử lý input và lỗi**:
   - Thêm sự kiện `onChange` cho input để cập nhật state.
   - Kiểm tra input trống khi nhấn nút gửi và hiển thị thông báo lỗi.
3. **Định dạng giao diện**:
   - Sử dụng inline CSS hoặc file CSS riêng để tạo giao diện đẹp.

### Đáp án
Tạo file `app/send/page.tsx`:
```tsx
'use client';
import { useState } from 'react';

export default function Send() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!recipient || !amount) {
      setError('Vui lòng nhập đầy đủ địa chỉ ví và số lượng ADA');
      return;
    }
    setError('');
    // Logic gửi ADA sẽ được thêm ở bài tập sau
    console.log('Recipient:', recipient, 'Amount:', amount);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Gửi ADA</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Địa chỉ ví nhận:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Số lượng ADA:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Gửi ADA
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/send`, nhập địa chỉ ví và số lượng ADA, nhấn nút "Gửi ADA" để kiểm tra console log và thông báo lỗi nếu input trống.

---

## 📝 Bài tập 2: Kết nối ví và hiển thị số dư

### Đề bài
Tích hợp ví Cardano vào trang `/send` để hiển thị số dư ADA sau khi kết nối.

### Yêu cầu
- Sử dụng MeshJS để kết nối ví (như Eternl).
- Hiển thị số dư ADA của ví sau khi kết nối.
- Hiển thị thông báo lỗi nếu ví chưa kết nối.
- Định dạng giao diện số dư.

### Cách giải
1. **Cài đặt MeshJS**:
   - Cài đặt `@meshsdk/core` và `@meshsdk/react`.
2. **Tích hợp ví**:
   - Sử dụng hook `useWallet` để kết nối ví và lấy số dư.
   - Thêm nút "Connect Wallet" và hiển thị số dư sau khi kết nối.
3. **Xử lý lỗi**:
   - Kiểm tra trạng thái kết nối ví trước khi lấy số dư.
4. **Định dạng**:
   - Sử dụng inline CSS để hiển thị số dư.

### Đáp án
Cài đặt:
```bash
npm install @meshsdk/core @meshsdk/react
```

Sửa file `app/send/page.tsx`:
```tsx
'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';

export default function Send() {
  const { connect, wallet, connected } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    if (connected) {
      async function fetchBalance() {
        try {
          const balance = await wallet.getBalance();
          const ada = balance.find((asset) => asset.unit === 'lovelace')?.quantity || '0';
          setBalance(`${parseInt(ada) / 1000000} ADA`);
        } catch (err) {
          setBalance('Lỗi khi lấy số dư');
        }
      }
      fetchBalance();
    }
  }, [connected, wallet]);

  const handleSubmit = () => {
    if (!connected) {
      setError('Vui lòng kết nối ví!');
      return;
    }
    if (!recipient || !amount) {
      setError('Vui lòng nhập đầy đủ địa chỉ ví và số lượng ADA');
      return;
    }
    setError('');
    console.log('Recipient:', recipient, 'Amount:', amount);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Gửi ADA</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {!connected ? (
          <button
            onClick={() => connect('eternl')}
            style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px' }}
          >
            Connect Wallet
          </button>
        ) : (
          <p style={{ marginBottom: '20px' }}>Số dư: {balance}</p>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label>Địa chỉ ví nhận:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Số lượng ADA:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Gửi ADA
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/send`, nhấn "Connect Wallet" để kết nối ví Eternl và hiển thị số dư ADA.

---

## 📝 Bài tập 3: Tạo giao dịch trên Client-side

### Đề bài
Tạo giao dịch gửi ADA trên client-side sử dụng MeshJS.

### Yêu cầu
- Sử dụng MeshJS để xây dựng và ký giao dịch gửi ADA từ form `/send`.
- Kiểm tra ví đã kết nối và input hợp lệ trước khi tạo giao dịch.
- Hiển thị Tx Hash sau khi giao dịch thành công.
- Xử lý lỗi nếu giao dịch thất bại.

### Cách giải
1. **Xây dựng giao dịch**:
   - Sử dụng `Transaction` từ `@meshsdk/core` để tạo giao dịch.
   - Lấy địa chỉ ví nhận và số lượng ADA từ state.
2. **Ký và gửi giao dịch**:
   - Ký giao dịch bằng ví trình duyệt và submit lên blockchain.
3. **Xử lý lỗi**:
   - Kiểm tra kết nối ví và input, hiển thị thông báo lỗi nếu cần.
4. **Hiển thị Tx Hash**:
   - Hiển thị Tx Hash trong giao diện sau khi submit thành công.

### Đáp án
Sửa file `app/send/page.tsx`:
```tsx
'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';

export default function Send() {
  const { connect, wallet, connected } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    if (connected) {
      async function fetchBalance() {
        try {
          const balance = await wallet.getBalance();
          const ada = balance.find((asset) => asset.unit === 'lovelace')?.quantity || '0';
          setBalance(`${parseInt(ada) / 1000000} ADA`);
        } catch (err) {
          setBalance('Lỗi khi lấy số dư');
        }
      }
      fetchBalance();
    }
  }, [connected, wallet]);

  const handleSubmit = async () => {
    if (!connected) {
      setError('Vui lòng kết nối ví!');
      return;
    }
    if (!recipient || !amount) {
      setError('Vui lòng nhập đầy đủ địa chỉ ví và số lượng ADA');
      return;
    }

    try {
      const tx = new Transaction({ initiator: wallet });
      tx.sendAssets(
        { address: recipient },
        [{ unit: 'lovelace', quantity: `${Number(amount) * 1000000}` }], // ADA to lovelace
      );

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      setTxHash(txHash);
      setError('');
    } catch (err) {
      setError(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Gửi ADA</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {!connected ? (
          <button
            onClick={() => connect('eternl')}
            style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px' }}
          >
            Connect Wallet
          </button>
        ) : (
          <p style={{ marginBottom: '20px' }}>Số dư: {balance}</p>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label>Địa chỉ ví nhận:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Số lượng ADA:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Gửi ADA
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {txHash && (
          <p style={{ color: 'green', marginTop: '10px' }}>
            Giao dịch thành công! Tx Hash: <a href={`https://preprod.cardanoscan.io/transaction/${txHash}`} target="_blank">{txHash}</a>
          </p>
        )}
      </div>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/send`, kết nối ví, nhập địa chỉ ví nhận và số lượng ADA, nhấn "Gửi ADA" để gửi giao dịch và xem Tx Hash trên [CardanoScan](https://preprod.cardanoscan.io/).

---

## 📝 Bài tập 4: Tạo giao dịch trên Server-side

### Đề bài
Tạo giao dịch gửi ADA trên server-side sử dụng MeshJS và Blockfrost.

### Yêu cầu
- Tạo API route `/api/cardano/send` để xây dựng giao dịch unsigned.
- Gửi thông tin người nhận, số lượng ADA, và địa chỉ người gửi từ client.
- Ký và submit giao dịch trên client-side.
- Hiển thị Tx Hash sau khi giao dịch thành công.

### Cách giải
1. **Tạo API route**:
   - Tạo file `app/api/cardano/send/route.ts` để xây dựng giao dịch unsigned bằng MeshJS và Blockfrost.
   - Lấy UTxO từ Blockfrost dựa trên địa chỉ người gửi.
2. **Gửi request từ client**:
   - Sửa `app/send/page.tsx` để gửi POST request đến API route với thông tin người gửi, người nhận, và số lượng ADA.
3. **Ký và submit**:
   - Nhận unsigned transaction từ server, ký bằng ví trên client, và submit.
4. **Hiển thị kết quả**:
   - Hiển thị Tx Hash hoặc lỗi trong giao diện.

### Đáp án
Tạo file `app/api/cardano/send/route.ts`:
```ts
import { NextResponse } from 'next/server';
import { Transaction } from '@meshsdk/core';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export async function POST(request: Request) {
  try {
    const { sender, recipient, amount } = await request.json();
    if (!sender || !recipient || !amount) {
      return NextResponse.json({ error: 'Thiếu thông tin người gửi, người nhận hoặc số lượng ADA' }, { status: 400 });
    }

    const api = new BlockFrostAPI({ projectId: 'preprodYourProjectIdHere' }); // Thay bằng project ID của bạn
    const utxos = await api.addressesUtxos(sender);

    const formattedUtxos = utxos.map((utxo) => ({
      input: { outputIndex: utxo.output_index, txHash: utxo.tx_hash },
      output: { address: utxo.address, amount: utxo.amount },
    }));

    const tx = new Transaction();
    tx.sendAssets({ address: recipient }, [{ unit: 'lovelace', quantity: `${Number(amount) * 1000000}` }]);
    tx.setTxInputs(formattedUtxos);

    const unsignedTx = await tx.build();
    return NextResponse.json({ unsignedTx });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Sửa file `app/send/page.tsx`:
```tsx
'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';

export default function Send() {
  const { connect, wallet, connected, walletAddress } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    if (connected) {
      async function fetchBalance() {
        try {
          const balance = await wallet.getBalance();
          const ada = balance.find((asset) => asset.unit === 'lovelace')?.quantity || '0';
          setBalance(`${parseInt(ada) / 1000000} ADA`);
        } catch (err) {
          setBalance('Lỗi khi lấy số dư');
        }
      }
      fetchBalance();
    }
  }, [connected, wallet]);

  const handleSubmit = async () => {
    if (!connected) {
      setError('Vui lòng kết nối ví!');
      return;
    }
    if (!recipient || !amount) {
      setError('Vui lòng nhập đầy đủ địa chỉ ví và số lượng ADA');
      return;
    }

    try {
      const response = await fetch('/api/cardano/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: walletAddress, recipient, amount }),
      });
      const { unsignedTx, error } = await response.json();
      if (error) throw new Error(error);

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      setTxHash(txHash);
      setError('');
    } catch (err) {
      setError(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Gửi ADA</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {!connected ? (
          <button
            onClick={() => connect('eternl')}
            style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px' }}
          >
            Connect Wallet
          </button>
        ) : (
          <p style={{ marginBottom: '20px' }}>Số dư: {balance}</p>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label>Địa chỉ ví nhận:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Số lượng ADA:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Gửi ADA
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {txHash && (
          <p style={{ color: 'green', marginTop: '10px' }}>
            Giao dịch thành công! Tx Hash: <a href={`https://preprod.cardanoscan.io/transaction/${txHash}`} target="_blank">{txHash}</a>
          </p>
        )}
      </div>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/send`, kết nối ví, nhập địa chỉ ví nhận và số lượng ADA, nhấn "Gửi ADA" để gửi giao dịch qua server-side. Kiểm tra Tx Hash trên [CardanoScan](https://preprod.cardanoscan.io/).

---

## 📝 Bài tập 5: So sánh Client-side và Server-side cho Giao dịch

### Đề bài
So sánh việc tạo giao dịch trên client-side và server-side, triển khai một giao diện để chuyển đổi giữa hai phương thức.

### Yêu cầu
- Tạo trang `/send` với tùy chọn chuyển đổi giữa client-side và server-side.
- Hiển thị thời gian thực thi giao dịch cho mỗi phương thức.
- Liệt kê ưu/nhược điểm của mỗi phương thức.
- Đảm bảo giao diện hiển thị Tx Hash và lỗi.

### Cách giải
1. **Tạo giao diện**:
   - Sửa `app/send/page.tsx` để thêm dropdown chọn phương thức (client-side/server-side).
   - Thêm biến state để theo dõi thời gian thực thi.
2. **Triển khai hai phương thức**:
   - Client-side: Sử dụng logic từ Bài tập 3.
   - Server-side: Sử dụng logic từ Bài tập 4.
3. **Đo thời gian thực thi**:
   - Sử dụng `Date.now()` để tính thời gian trước và sau khi thực hiện giao dịch.
4. **So sánh ưu/nhược điểm**:
   - Client-side: Nhanh hơn nhưng lộ logic.
   - Server-side: Bảo mật hơn nhưng chậm hơn do request server.

### Đáp án
Sửa file `app/send/page.tsx`:
```tsx
'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';

export default function Send() {
  const { connect, wallet, connected, walletAddress } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState('');
  const [txHash, setTxHash] = useState('');
  const [method, setMethod] = useState('client');
  const [executionTime, setExecutionTime] = useState('');

  useEffect(() => {
    if (connected) {
      async function fetchBalance() {
        try {
          const balance = await wallet.getBalance();
          const ada = balance.find((asset) => asset.unit === 'lovelace')?.quantity || '0';
          setBalance(`${parseInt(ada) / 1000000} ADA`);
        } catch (err) {
          setBalance('Lỗi khi lấy số dư');
        }
      }
      fetchBalance();
    }
  }, [connected, wallet]);

  const handleSubmit = async () => {
    if (!connected) {
      setError('Vui lòng kết nối ví!');
      return;
    }
    if (!recipient || !amount) {
      setError('Vui lòng nhập đầy đủ địa chỉ ví và số lượng ADA');
      return;
    }

    const startTime = Date.now();
    try {
      if (method === 'client') {
        const tx = new Transaction({ initiator: wallet });
        tx.sendAssets(
          { address: recipient },
          [{ unit: 'lovelace', quantity: `${Number(amount) * 1000000}` }],
        );
        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        setTxHash(txHash);
        setError('');
      } else {
        const response = await fetch('/api/cardano/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sender: walletAddress, recipient, amount }),
        });
        const { unsignedTx, error } = await response.json();
        if (error) throw new Error(error);
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        setTxHash(txHash);
        setError('');
      }
      const endTime = Date.now();
      setExecutionTime(`${endTime - startTime} ms`);
    } catch (err) {
      setError(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Gửi ADA</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {!connected ? (
          <button
            onClick={() => connect('eternl')}
            style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px' }}
          >
            Connect Wallet
          </button>
        ) : (
          <p style={{ marginBottom: '20px' }}>Số dư: {balance}</p>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label>Phương thức:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="client">Client-side</option>
            <option value="server">Server-side</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Địa chỉ ví nhận:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Số lượng ADA:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Gửi ADA
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {txHash && (
          <p style={{ color: 'green', marginTop: '10px' }}>
            Giao dịch thành công! Tx Hash: <a href={`https://preprod.cardanoscan.io/transaction/${txHash}`} target="_blank">{txHash}</a>
          </p>
        )}
        {executionTime && <p style={{ marginTop: '10px' }}>Thời gian thực thi: {executionTime}</p>}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Ưu/Nhược điểm</h3>
        <p><strong>Client-side:</strong> Nhanh hơn, không cần server request. Nhược điểm: Lộ logic giao dịch, không phù hợp với giao dịch phức tạp như đa chữ ký.</p>
        <p><strong>Server-side:</strong> Bảo mật hơn, hỗ trợ giao dịch phức tạp. Nhược điểm: Chậm hơn do request server, phụ thuộc vào server.</p>
      </div>
    </div>
  );
}
```

**Ưu/Nhược điểm**:
- **Client-side**: 
  - **Ưu điểm**: Nhanh hơn, không cần gửi request đến server.
  - **Nhược điểm**: Lộ logic giao dịch, không phù hợp với giao dịch phức tạp như đa chữ ký.
- **Server-side**: 
  - **Ưu điểm**: Bảo mật hơn, hỗ trợ logic phức tạp, không lộ thông tin giao dịch.
  - **Nhược điểm**: Chậm hơn do request server, phụ thuộc vào server.

Chạy `npm run dev`, truy cập `http://localhost:3000/send`, chọn phương thức (client/server), nhập địa chỉ ví nhận và số lượng ADA, nhấn "Gửi ADA" để kiểm tra thời gian thực thi và Tx Hash.

---

### Ghi chú
- File Markdown trên có thể được tải về để học tập hoặc giảng dạy.
- Các bài tập được thiết kế từ cơ bản đến nâng cao, phù hợp với nội dung tài liệu về tạo giao dịch trên Cardano.
- Bạn cần ví Cardano (như Eternl) với test ADA trên mạng Preprod và project ID từ [Blockfrost](https://blockfrost.io/) cho server-side.
- Nếu bạn cần thêm bài tập, chỉnh sửa, hoặc giải thích chi tiết hơn, hãy cho tôi biết!