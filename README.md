# oracle-v2-deployer

## How to use

1. Install dependencies
```shell
npm i
cp .env.example .env
```

2. Edit .env

```
PRIVATE_KEY=INSERT_YOUR_DEPLOYER_PRIVATE_KEY_HERE___MUST_BE_OPERATOR_OF_BATCH_FACTORY
RPC_URL=https://goerli.infura.io/v3/f52bd8e7578c435c978ab9cf68cd3a18

FACTORY_ADDRESS=MAKE_SURE_IT_IS_RIGHT_FOR_YOUR_CHAIN
BATCH_FACTORY_ADDRESS=MAKE_SURE_IT_IS_RIGHT_FOR_YOUR_CHAIN

INPUT_CSV_FILE_PATH=/INSERT_CSV_FILE_PATH_HERE/input.csv
OUTPUT_CSV_FILE_PATH=/INSERT_CSV_FILE_PATH_HERE/output.csv

DEFAULT_CLIENT_BASIS_POINTS=THIS_VALUE_WILL_REPLACE_ZERO_FEES_IN_INPUT_CSV_FILE
```

3. Make sure you have a valid CSV at `/INSERT_CSV_FILE_PATH_HERE/input.csv`

It should be in a format:
```
validator_index,validator_key,withdrawal_address,fee
420042,0x426fcf39629578fdcfb26523f5bce834233ffeb9a5ee4aa48a4ac9bafd85775042e859823696ef61080b6d298e124221,0x42282481aecaf41b93289153a219ba4222699f42,0.15
```

4. Make sure you `PRIVATE_KEY` corresponds to an address that has operator privileges in the `BatchFactory` contract.


5. Make sure `BatchFactory` has operator privileges in the `FeeDistributorFactory` contract.


6. Run
```shell
ts-node deploy.ts
```

7. Use CSV output from `/INSERT_CSV_FILE_PATH_HERE/output.csv`. It will be in a format:

```
pubkey,fee_divider
0x426fcf39629578fdcfb26523f5bce834233ffeb9a5ee4aa48a4ac9bafd85775042e859823696ef61080b6d298e124221,0x7354442cC168Bfa42f1dbd61518718a7322942d7
```
