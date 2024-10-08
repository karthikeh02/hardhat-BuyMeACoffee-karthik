import abi from "./utils/BuyMeACoffee.json";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import image from "./image/ban.webp";

function App() {
  const contractAddress = "0x4Df203A66313C1B5c5501008c0eAD8e9ab2Da28C";
  const contractAbi = abi.abi;

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        alert("Wallet is Connected! " + account);
        console.log("wallet is connected! " + account);
      } else {
        console.log("Make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        console.log("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Move getMemos outside of connectWallet
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched memos!");

        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos(); // Now it can be called here

    const onNewMemo = (from, timeStamp, name, message) => {
      console.log("New memo Received", from, timeStamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timeStamp: new Date(timeStamp.toNumber() * 1000),
          name,
          message,
        },
      ]);
    };

    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractAbi, signer);
      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        console.log("Buying A Coffee....");
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "Anonymous",
          message ? message : "Enjoy your coffee!",
          {
            value: ethers.utils.parseEther("0.001"),
          }
        );
        alert("Buying coffee. Please wait...");
        await coffeeTxn.wait();
        console.log("Mined ", coffeeTxn.hash);
        console.log("Coffee purchased!");
        alert("Thanks for the Coffee!");

        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <title className="title">Buy Karthik A Coffee</title>

      <main className="main">
        <img src={image} style={{ width: "1440px", height: "420px" }} />
        {currentAccount ? (
          <div>
            <form>
              <div>
                <label>Name</label>
                <br />
                <input
                  id="name"
                  type="text"
                  placeholder="anon"
                  onChange={onNameChange}
                />
              </div>
              <br />
              <div>
                <label>Send Karthik A Message</label>
                <br />
                <textarea
                  rows={3}
                  placeholder="Enjoy your coffee!"
                  id="message"
                  onChange={onMessageChange}
                  required
                />
              </div>
              <div>
                <button type="button" onClick={buyCoffee}>
                  {" "}
                  Send 1 Coffee for 0.001 SEPOLIA ETH{" "}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Your Wallet</button>
        )}
      </main>

      {currentAccount && <h1>Coffee's Received</h1>}

      {currentAccount &&
        memos.map((memo, idx) => {
          return (
            <div
              key={idx}
              style={{
                border: "2px solid",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px",
              }}
            >
              <p styles={{ fontSize: "bold" }}>{memo.message}</p>
              <p>
                {" "}
                From : {memo.name} at {memo.timeStamp.toString()}
                <br />
                Wallet Address : {memo.address}
              </p>
            </div>
          );
        })}
      <footer className="footer">Karthik</footer>
    </div>
  );
}

export default App;

// // import abi from "./utils/BuyMeACoffee.json";
// // import { ethers } from "ethers";
// // import React, { useState, useEffect } from "react";

// // function App() {
// //   const contractAddress = "0x4Df203A66313C1B5c5501008c0eAD8e9ab2Da28C";
// //   const contractAbi = abi.abi;

// //   const [name, setName] = useState("");
// //   const [message, setMessage] = useState("");
// //   const [currentAccount, setCurrentAccount] = useState("");
// //   const [memos, setMemos] = useState([]);

// //   const onNameChange = (event) => {
// //     setName(event.target.value);
// //   };

// //   const onMessageChange = (event) => {
// //     setMessage(event.target.value);
// //   };

// //   const isWalletConnected = async () => {
// //     try {
// //       const { ethereum } = window;
// //       const accounts = await ethereum.request({ method: "eth_accounts" });
// //       console.log("accounts: ", accounts);

// //       if (accounts.length > 0) {
// //         const account = accounts[0];
// //         alert("Wallet is Connected! " + account);
// //         console.log("wallet is connected! " + account);
// //       } else {
// //         alert("Make sure MetaMask is connected");
// //         console.log("Make sure MetaMask is connected");
// //       }
// //     } catch (error) {
// //       console.log("error: ", error);
// //     }
// //   };

// //   const connectWallet = async () => {
// //     try {
// //       const { ethereum } = window;
// //       if (!ethereum) {
// //         alert("Get MetaMask!");
// //         console.log("Get MetaMask!");
// //       }
// //       const accounts = await ethereum.request({
// //         method: "eth_requestAccounts",
// //       });
// //       setCurrentAccount(accounts[0]);
// //     } catch (error) {
// //       console.log(error);
// //     }

// //     const getMemos = async () => {
// //       try {
// //         const { ethereum } = window;
// //         if (ethereum) {
// //           const provider = new ethers.BrowserProvider(ethereum);
// //           const signer = await provider.getSigner();
// //           const buyMeACoffee = new ethers.Contract(
// //             contractAddress,
// //             contractAbi,
// //             signer
// //           );

// //           console.log("fetching memos from the blockchain..");
// //           const memos = await buyMeACoffee.getMemos();
// //           console.log("fetched memos!");

// //           setMemos(memos);
// //         } else {
// //           console.log("Metamask is not connected");
// //         }
// //       } catch (error) {
// //         console.log(error);
// //       }
// //     };
// //   };

// //   useEffect(() => {
// //     let buyMeACoffee;
// //     isWalletConnected();
// //     connectWallet();
// //     getMemos();

// //     const onNewMemo = (from, timeStamp, name, message) => {
// //       console.log("New memo Received", from, timeStamp, name, message);
// //       setMemos((prevState) => [
// //         ...prevState,
// //         {
// //           address: from,
// //           timeStamp: new Date(Number(timeStamp) * 1000),
// //           name,
// //           message,
// //         },
// //       ]);
// //     };

// //     const { ethereum } = window;
// //     if (ethereum) {
// //       const provider = new ethers.BrowserProvider(ethereum);
// //       const signer = await provider.getSigner();
// //       buyMeACoffee = new ethers.Contract(contractAddress, contractAbi, signer);
// //       buyMeACoffee.on("NewMemo", onNewMemo);
// //     }

// //     return () => {
// //       if (buyMeACoffee) {
// //         buyMeACoffee.off("NewMemo", onNewMemo);
// //       }
// //     };
// //   }, []);

// //   const buyCoffee = async () => {
// //     try {
// //       const { ethereum } = window;
// //       if (ethereum) {
// //         const provider = new ethers.BrowserProvider(ethereum);
// //         const signer = await provider.getSigner();
// //         const buyMeACoffee = new ethers.Contract(
// //           contractAddress,
// //           contractAbi,
// //           signer
// //         );
// //         console.log("Buying A Coffee....");
// //         const coffeeTxn = await buyMeACoffee.buyCoffee(
// //           name || "Anonymous",
// //           message || "Enjoy your coffee!",
// //           {
// //             value: ethers.parseEther("0.001"),
// //           }
// //         );
// //         alert("Buying coffee. Please wait...");
// //         await coffeeTxn.wait();
// //         console.log("Mined ", coffeeTxn.hash);
// //         console.log("Coffee purchased!");
// //         alert("Thanks for the Coffee!");

// //         setName("");
// //         setMessage("");
// //       }
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   return (
// //     <div className="App">
// //       <title>Buy Karthik A Coffee</title>

// //       <main className="main">
// //         {currentAccount ? (
// //           <div>
// //             <form>
// //               <div>
// //                 <label>Name</label>
// //                 <br />
// //                 <input
// //                   id="name"
// //                   type="text"
// //                   placeholder="anon"
// //                   onChange={onNameChange}
// //                 />
// //               </div>
// //               <br />
// //               <div>
// //                 <label>Send Karthik A Message</label>
// //                 <br />
// //                 <textarea
// //                   rows={3}
// //                   placeholder="Enjoy your coffee!"
// //                   id="message"
// //                   onChange={onMessageChange}
// //                   required
// //                 />
// //               </div>
// //               <div>
// //                 <button type="button" onClick={buyCoffee}>
// //                   Send 1 Coffee for 0.001 MATIC
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         ) : (
// //           <button onClick={connectWallet}>Connect Your Wallet</button>
// //         )}
// //       </main>

// //       {currentAccount && <h1>Coffee's Received</h1>}

// //       {currentAccount &&
// //         memos.map((memo, idx) => {
// //           return (
// //             <div
// //               key={idx}
// //               style={{
// //                 border: "2px solid",
// //                 borderRadius: "5px",
// //                 padding: "5px",
// //                 margin: "5px",
// //               }}
// //             >
// //               <p styles={{ fontSize: "bold" }}>{memo.message}</p>
// //               <p>
// //                 From: {memo.name} at {memo.timeStamp.toString()}
// //                 <br />
// //                 Wallet Address: {memo.address}
// //               </p>
// //             </div>
// //           );
// //         })}
// //     </div>
// //   );
// // }

// // export default App;
// import abi from "./utils/BuyMeACoffee.json";
// import { ethers } from "ethers";
// import React, { useState, useEffect } from "react";

// function App() {
//   const contractAddress = "0x4Df203A66313C1B5c5501008c0eAD8e9ab2Da28C";
//   const contractAbi = abi.abi;

//   const [name, setName] = useState("");
//   const [message, setMessage] = useState("");
//   const [currentAccount, setCurrentAccount] = useState("");
//   const [memos, setMemos] = useState([]);

//   const onNameChange = (event) => {
//     setName(event.target.value);
//   };

//   const onMessageChange = (event) => {
//     setMessage(event.target.value);
//   };

//   const isWalletConnected = async () => {
//     try {
//       const { ethereum } = window;
//       if (ethereum) {
//         const accounts = await ethereum.request({ method: "eth_accounts" });
//         if (accounts.length > 0) {
//           const account = accounts[0];
//           setCurrentAccount(account);
//           alert("Wallet is Connected! " + account);
//           console.log("wallet is connected! " + account);
//         } else {
//           console.log("Make sure MetaMask is connected");
//         }
//       } else {
//         alert("MetaMask is not installed!");
//         console.log("MetaMask is not installed!");
//       }
//     } catch (error) {
//       console.log("error: ", error);
//     }
//   };

//   const connectWallet = async () => {
//     try {
//       const { ethereum } = window;
//       if (!ethereum) {
//         alert("Get MetaMask!");
//         return;
//       }
//       const accounts = await ethereum.request({
//         method: "eth_requestAccounts",
//       });
//       setCurrentAccount(accounts[0]);
//       console.log("Wallet connected: ", accounts[0]);
//       getMemos(); // Call getMemos after connecting the wallet
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getMemos = async () => {
//     try {
//       const { ethereum } = window;
//       if (ethereum) {
//         const provider = new ethers.BrowserProvider(ethereum);
//         const signer = await provider.getSigner();
//         const buyMeACoffee = new ethers.Contract(
//           contractAddress,
//           contractAbi,
//           signer
//         );

//         console.log("Fetching memos from the blockchain...");
//         const memos = await buyMeACoffee.getMemos();
//         console.log("Fetched memos!");

//         setMemos(memos);
//       } else {
//         console.log("MetaMask is not connected");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       await isWalletConnected();
//       if (currentAccount) {
//         await getMemos();
//       }
//     };
//     fetchData();

//     const onNewMemo = (from, timeStamp, name, message) => {
//       console.log("New memo received", from, timeStamp, name, message);
//       setMemos((prevState) => [
//         ...prevState,
//         {
//           address: from,
//           timeStamp: new Date(Number(timeStamp) * 1000),
//           name,
//           message,
//         },
//       ]);
//     };

//     let buyMeACoffee;
//     const { ethereum } = window;
//     if (ethereum) {
//       const provider = new ethers.BrowserProvider(ethereum);
//       const signer = provider.getSigner();
//       buyMeACoffee = new ethers.Contract(contractAddress, contractAbi, signer);
//       buyMeACoffee.on("NewMemo", onNewMemo);
//     }

//     return () => {
//       if (buyMeACoffee) {
//         buyMeACoffee.off("NewMemo", onNewMemo);
//       }
//     };
//   }, [currentAccount]);

//   const buyCoffee = async () => {
//     try {
//       const { ethereum } = window;
//       if (ethereum) {
//         const provider = new ethers.BrowserProvider(ethereum);
//         const signer = await provider.getSigner();
//         const buyMeACoffee = new ethers.Contract(
//           contractAddress,
//           contractAbi,
//           signer
//         );
//         console.log("Buying A Coffee....");
//         const coffeeTxn = await buyMeACoffee.buyCoffee(
//           name || "Anonymous",
//           message || "Enjoy your coffee!",
//           {
//             value: ethers.parseEther("0.001"),
//           }
//         );
//         alert("Buying coffee. Please wait...");
//         await coffeeTxn.wait();
//         console.log("Mined ", coffeeTxn.hash);
//         console.log("Coffee purchased!");
//         alert("Thanks for the Coffee!");

//         setName("");
//         setMessage("");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="App">
//       <title>Buy Karthik A Coffee</title>

//       <main className="main">
//         {currentAccount ? (
//           <div>
//             <form>
//               <div>
//                 <label>Name</label>
//                 <br />
//                 <input
//                   id="name"
//                   type="text"
//                   placeholder="anon"
//                   value={name}
//                   onChange={onNameChange}
//                 />
//               </div>
//               <br />
//               <div>
//                 <label>Send Karthik A Message</label>
//                 <br />
//                 <textarea
//                   rows={3}
//                   placeholder="Enjoy your coffee!"
//                   id="message"
//                   value={message}
//                   onChange={onMessageChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <button type="button" onClick={buyCoffee}>
//                   Send 1 Coffee for 0.001 MATIC
//                 </button>
//               </div>
//             </form>
//           </div>
//         ) : (
//           <button onClick={connectWallet}>Connect Your Wallet</button>
//         )}
//       </main>

//       {currentAccount && <h1>Coffee's Received</h1>}

//       {currentAccount &&
//         memos.map((memo, idx) => {
//           return (
//             <div
//               key={idx}
//               style={{
//                 border: "2px solid",
//                 borderRadius: "5px",
//                 padding: "5px",
//                 margin: "5px",
//               }}
//             >
//               <p styles={{ fontSize: "bold" }}>{memo.message}</p>
//               <p>
//                 From: {memo.name} at {memo.timeStamp.toString()}
//                 <br />
//                 Wallet Address: {memo.address}
//               </p>
//             </div>
//           );
//         })}
//     </div>
//   );
// }

// export default App;
