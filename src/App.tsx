import React, { useState } from 'react';
import massa from './assets/massa-logo.png';
import './App.css';
import {
    ClientFactory,
    DefaultProviderUrls,
    IAccount,
    WalletClient,
    INodeStatus,
} from '@massalabs/massa-web3';

export const BASE_ACCOUNT_SECRET_KEY = 'S13iFJarF4v6CxYPeguUQHqkxDdGZgFhrsiEMznbnS3is9aXFps';

const constructWeb3Client = async () => {
    const baseAccount: IAccount = await WalletClient.getAccountFromSecretKey(
        BASE_ACCOUNT_SECRET_KEY,
    );
    const web3Client = await ClientFactory.createDefaultClient(
        DefaultProviderUrls.TESTNET,
        true,
        baseAccount,
    );
    return web3Client;
};

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

const getNodeOverview = (nodeStatus: INodeStatus | null): JSX.Element => {
    if (!nodeStatus) {
        return <React.Fragment>{"Getting Massa's Node Status..."}</React.Fragment>;
    }
    return (
        <React.Fragment>
            Massa Net Version: {nodeStatus?.version}
            <br />
            Massa Net Node Id: {nodeStatus?.node_id}
            <br />
            Massa Net Node Ip: {nodeStatus?.node_ip}
            <br />
            Massa Net Time: {nodeStatus?.current_time}
            <br />
            Massa Net Cycle: {nodeStatus?.current_cycle}
            <br />
        </React.Fragment>
    );
};

function App() {
    const [nodeStatus, setNodeStatus] = useState<INodeStatus | null>(null);

    useAsyncEffect(async () => {
        try {
            const web3Client = await constructWeb3Client();
            const nodeStatus = await web3Client.publicApi().getNodeStatus();
            setNodeStatus(nodeStatus);
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <React.Fragment>
            <img src={massa} className="App-logo" alt="logo" />
            <hr />
            {getNodeOverview(nodeStatus)}
        </React.Fragment>
    );
}

export default App;
