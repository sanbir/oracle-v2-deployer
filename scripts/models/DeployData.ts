import {ClientConfig} from "./ClientConfig";
import {ethers} from "ethers";

export interface DeployData {
    clientConfig: ClientConfig
    pubkey: string,
    feeDistributorAddress: string,
    clientOnlyClRewards: ethers.BigNumber
}
