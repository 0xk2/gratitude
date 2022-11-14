# Gratitude Project

## On Identity

It is great roaming free as an anon on crypto, but soon you realize what you want is not an PFP anon but a different identity from your meatspace aka IRL where you have little control over your self.

So, what is identity? An identity is a basket of connections you have with others. Controlling your identity means mindfully build your connection / your proof of work.

## Proof of work

Gratitude is the proof of work that one send to other.
```
sendToken(IERC20 token, address[] memory _recipients, uint256[] memory values, string[] memory content)
```

those info will be stored in

```
struct Cert {
  address from;
  address token;
  uint256 amount;
  string content;
}
mapping (address => uint256) public recipients;
mapping (address => mapping(uint256 => Cert)) public certs;
```

The `content` is an IPFS hash that represent the work content. The collection of each address's `content` is an identity:

```
for(uint256 i=0; i<recipients[_address]; i++){
  certs[address][i]
}
```

## Future development

There are few things in my mind:

- Who should give other `proof of work`? probably a DAO is the best one since a DAO's treasury is usually `public` and `multisig` so its proof is more valuable than a `EOA`. Thus, building a gnosis-safe tool as explaining [here](https://www.notion.so/hieub/Multisig-tool-for-Treasury-spending-322913134f1d496cb1325a14f22bb2b5) is in my roadmap.

- Rendering on-chain identity data is should be a big thing (that's basically what Facebook/Meta has done). I will try a demo, but it should be everyone's job. Never we should have a centralized identity rendering again.

- There are vast amount of existing on-chain transactions, put some comment on it should help bring the identity alive.

- This simple contract now support Token and Coin, it also should do the same with NFT.