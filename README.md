# Multitoken Wrapping

The challenge is to create a token swapping Solidity smart contract and deploy it on Avalanche. The user should be able to swap either of two ERC20s for a single ERC20 token. For example, you can swap token A or token B for token C. Swaps should also be possible in the reverse direction.Token C should be redeemable for token A or token B. Token exchange rates are one-to-one. Input side ERC20 tokens do not need to swappable for each other. You do not need a method to swap token A for token B.

A || B <==> C

## Provided Stub

Attached is a Solidity stub for the Wrapper contract. It contains two methods: `function swap(address token_, uint amount)` and `function unswap(address token_, uint amount)`. Please implement these methods. Feel free to add whatever other methods and contracts are necessary.

## Token Parameters

Please give each token its own unique name and symbol. Do not name them tokens A, B, and C. Tokens may all have the same number of decimals.

### Token Minting

Tokens A and B should be minted outside of wrapper contract. The wrapper contract should not be able to mint any new A or B tokens. Token C, however, should be minted exclusively from inside the Wrapper contract.

## External resources

Feel free to use any code from OpenZeppelin. You may import their contracts into your own or deploy theirs without modifications. Please refrain from using code from any other source.

## Development Environment

### Install Truffle cli

_Skip if you have already installed._

```
npm install -g truffle
```

### Install Dependencies

```
yarn install
```

### Run Tests

```
truffle develop
test
```

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.

AliceToken:  0x822F1B6529f64f21FE0993362dec121e200286f4
BobToken:  0xAb8b6B5c59Ad3B76B867a108726d5f22171117F0
CharlieToken:  0xC9Da8BaEd02215199d23Ad53613715174F3baf08
Wrapper:  0xe0F87BD970823bddD4231a614640007CdD3cc879
Owner:  0x68Efcd43A8Dd3b29a36203866106e4f74597e300


  Contract: Wrapper
    √ should initialize scenario (164ms)
    swap
      √ should swap token a to token c (630ms)
    unswap
      √ should unswap token c to token b (1162ms)


  3 passing (9s)

```

## Deploying on Fuji

Please check out `fuji` branch to see more complicated Avalanche deployment process.

## Pseudocode Call Sequence
1. Deploy AliceToken()
2. Deploy BobToken()
3. Deploy CharlieToken()
4. Deploy Wrapper(CharlieToken.address)
5. ChalieToken.setWrapper(Wrapper.address)
6. AliceToken.transfer(Wrapper.address, 1000)
7. BobToken.transfer(Wrapper.address, 1000)
8. AliceToken.approve(Wrapper.address, MAX_UINT256)
9. BobToken.approve(Wrapper.address, MAX_UINT256)
10. ChalieToken.approve(Wrapper.address, MAX_UINT256)

11. Wrapper.swap(AliceToken.address, 100)
12. Wrapper.unswap(BobToken.address, 100)
