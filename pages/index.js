import {useState, useCallback, useEffect} from "react";
import Head from "next/head";

import Web3 from "web3";

import StorageABI from "../contract/storage.json";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Home.module.css";
import EthForm from "./forms/EthForm";
import Erc20Form from "./forms/ERC20Form";


export default function Home() {

    const [isConnectedWeb3, setIsConnectedWeb3] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [web3, setWeb3] = useState(null);

    /**
     * Initialiser une connexion Web3
     * @type {(function(): Promise<void>)|*}
     */
    const connectToWeb3 = useCallback(async () => {
        if (window.ethereum) {
            try {

                await window.ethereum.request({method: "eth_requestAccounts"});
                setWeb3(new Web3(Web3.givenProvider || "ws://localhost:8545"));
                setIsConnectedWeb3(true);

                // Au changement de la blockchain
                window.ethereum.on('chainChanged', () => {
                    console.log("chainChanged")
                });

                // Au change de compte utilisateur
                window.ethereum.on('accountsChanged', () => {
                    console.log("accountsChanged");
                    exitWeb3Connexion();
                });

            } catch (err) {
                console.error(err);
            }
        } else {
            alert("Install Metamask");
        }
    });

    /**
     * Déconnexion Web3
     */
    const exitWeb3Connexion = () => {
        setWeb3(null);
        setAccounts([]);
        setIsConnectedWeb3(false);
    }

    /**
     * Connect to Smart Contract
     */
    useEffect(() => {
        if (web3) {
            // Accounts
            const getAccounts = async () => setAccounts(await web3.eth.getAccounts());
            if (accounts.length == 0) getAccounts();
        }
    }, [isConnectedWeb3]);

    /**
     * Display the connected mainnet
     * @returns {string}
     */
    const getNetwork = () => {
        const chainId = web3 ? web3.currentProvider.chainId : "";
        let network;

        switch (chainId) {
            case '0x1':
                network = 'Ethereum';
                break;
            case '0x2a':
                network = 'Kovan';
                break;
            case '0x3':
                network = 'Ropsten';
                break;
            case '0x4':
                network = 'Rinkeby';
                break;
            case '0x5':
                network = 'Goerli';
                break;
            default:
                network = '';
                break;
        }
        return network;
    }


    /**
     * Rendu JSX
     */
    return (
        <div className={styles.container}>

            <Head>
                <title>Wallet dApp</title>
                <meta name="description" content="Wallet dApp"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                {!isConnectedWeb3 ? (
                    <button className="btn btn-secondary btn-lg" onClick={connectToWeb3}>
                        Connect to web3
                    </button>
                ) : (
                    <button className="btn btn-secondary btn-lg disabled" disabled>
                        {getNetwork()}
                    </button>
                )}


                <EthForm
                    web3={web3}
                    accounts={accounts}
                    StorageABI={StorageABI}
                />

                <Erc20Form
                    web3={web3}
                    accounts={accounts}
                    StorageABI={StorageABI}
                />

            </main>
            <footer className={styles.footer}>
                <a
                    href="https://github.com/Margotte83/dApp_wallet_token"
                    rel="noreferrer"
                    target="_blank"
                >
                    My Github link
                </a>
            </footer>
        </div>
    );
}
