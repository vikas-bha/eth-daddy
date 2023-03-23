// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
// import "./node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// import "/home/ev1lclow3n/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract ETHDaddy is ERC721 {
    // string public name;
    // string public symbol;
    address public owner;
        uint256 public maxSupply;
    uint256 public totalSupply ;


    struct  Domain{
        string name ;
        uint256 cost;
        bool isOwned ;
    }
    // mapping(uint256 =>Domain) public domains;
    mapping(uint256=> Domain) domains;


 modifier onlyOwner() {
        require(msg.sender == owner);
        _;
        // this is something which states that run the require statement first and then run the functuon where this modifier is used
    }

    constructor(string memory _name , string memory _symbol) ERC721(_name, _symbol){
      owner = msg.sender;
    }

    // consutructer of ERC721 will be called 

    function list(string memory _name, uint256 _cost) public onlyOwner{
        maxSupply = maxSupply+1;
       domains[maxSupply]= Domain(_name, _cost, false);



    }

    function mint(uint256 _id) public payable{
        // derived from ERC721 and used to mint or save nft from scratach
        require(_id!=0);
        require(_id<=maxSupply);
        require(domains[_id].isOwned== false);

        require(msg.value == domains[_id].cost);

        domains[_id].isOwned = true;
        totalSupply++;
        _safeMint(msg.sender, _id);
    }
    function getDomain(uint256 _id) public view returns(Domain memory){
        return domains[_id];
    }

function getBalance() public view returns(uint256){
    return address(this).balance;
}

function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }


}
