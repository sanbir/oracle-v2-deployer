import {ClientConfig} from "./ClientConfig";
import {ValidatorData} from "./ValidatorData";

export interface DeployData {
    clientConfig: ClientConfig
    validatorData: ValidatorData,
    pubkey: string,
    feeDistributorAddress: string
}
