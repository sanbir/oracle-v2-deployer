import {ethers} from "ethers";

const abi = [{
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "_newFeeDistributorAddress",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "_clientAddress", "type": "address"}],
    "name": "FeeDistributorCreated",
    "type": "event"
}, {"inputs":[{"internalType":"address","name":"factory","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"}],"name":"Access__SameOperator","type":"error"},{"inputs":[],"name":"Access__ZeroNewOperator","type":"error"},{"inputs":[],"name":"Ownable2Step__CallerNotNewOwner","type":"error"},{"inputs":[{"internalType":"address","name":"_caller","type":"address"},{"internalType":"address","name":"_owner","type":"address"}],"name":"OwnableBase__CallerNotOwner","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_previousOperator","type":"address"},{"indexed":true,"internalType":"address","name":"_newOperator","type":"address"}],"name":"OperatorChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"_newOwner","type":"address"}],"name":"OwnershipTransferStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"_newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOperator","type":"address"}],"name":"changeOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint96","name":"basisPoints","type":"uint96"},{"internalType":"address payable","name":"recipient","type":"address"}],"internalType":"struct IFeeDistributor.FeeRecipient[]","name":"_clientConfigs","type":"tuple[]"},{"components":[{"internalType":"uint176","name":"clientOnlyClRewards","type":"uint176"},{"internalType":"uint64","name":"firstValidatorId","type":"uint64"},{"internalType":"uint16","name":"validatorCount","type":"uint16"}],"internalType":"struct IFeeDistributor.ValidatorData[]","name":"_validatorDatas","type":"tuple[]"}],"name":"createFeeDistributor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dismissOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"operator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]


export function getBatchFactorySigned() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    // @ts-ignore
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const batchFactorySigned = new ethers.Contract(process.env.BATCH_FACTORY_ADDRESS!, abi, wallet)
    return batchFactorySigned
}
