import React, { useState, useMemo } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import {
    Client,
    ClientFactory,
    DefaultProviderUrls,
    IAccount,
    WalletClient,
    Args,
} from '@massalabs/massa-web3';

export const baseAccountSecretKey = 'S13iFJarF4v6CxYPeguUQHqkxDdGZgFhrsiEMznbnS3is9aXFps';

function useAsyncEffect(
    fn: () => Promise<void | (() => void)>,
    dependencies?: React.DependencyList,
) {
    return React.useEffect(() => {
        const destructorPromise = fn();
        return () => {
            destructorPromise.then((destructor) => destructor && destructor());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}

function App() {
    const [count, setCount] = useState(0);
    const [web3Client, setWeb3Client] = useState<Client | null>(null);

    const memoWeb3Client: Client | null = useMemo(() => web3Client, []);

    useAsyncEffect(async () => {
        try {
            const baseAccount: IAccount = await WalletClient.getAccountFromSecretKey(
                baseAccountSecretKey,
            );
            if (!memoWeb3Client) {
                const web3Client = await ClientFactory.createDefaultClient(
                    DefaultProviderUrls.TESTNET,
                    true,
                    baseAccount,
                );
                const nodeStatus = await web3Client.publicApi().getNodeStatus();
                console.log('NODE STATUS', nodeStatus.last_slot);
                setWeb3Client(memoWeb3Client);
                const args = new Args().addF32(12.0).serialize();
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <div className="App">
            <div>
                <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
                    <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank" rel="noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </div>
    );
}

export default App;
