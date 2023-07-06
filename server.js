const express = require('express')
const axios = require('axios')
require('dotenv').config()
const {utils} = require('ethers')
const createCsvwriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const APIKEY=process.env.APIKEY;

const fetchData = async () =>{
    try {
        const listOfBlocks = [];
        for(let blockNumber=6456456;blockNumber <6456476;blockNumber++ ){
            const apiUrl = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blockNumber}&apikey=${APIKEY}`;

            const response = await axios.get(apiUrl);
            const rewardEther = utils.formatEther(response.data.result.blockReward);
            const timeStamp = response.data.result.timeStamp;
            const block = new Block(timeStamp,rewardEther);
            console.log(block);
            listOfBlocks.push(block);
            
        }
        exportToCsv(listOfBlocks);
        console.log(listOfBlocks);
    }catch(error) {
        console.error(error)
    }
}


const exportToCsv = (data) => {
    const csvwriter = createCsvwriter ({
        path: 'block_data.csv',
        header: [
            { id: 'timeStamp', title: 'timestamp'},
            { id: 'blockReward', title: 'blockReward'}
        ]
    });

    csvwriter
    .writeRecords(data).then(() => {
        console.log('CSV file created successfully');
    })
    .catch((error) => {
        console.error(error);
    });
}



class Block{
    constructor(timeStamp, blockReward){
        this.timeStamp = timeStamp;
        this.blockReward = blockReward;
    }
}

// (async()=>{
//     try {
//         await fetchData();

//     } catch(error){
//         console.error(error);
//     }

    
// });
fetchData();
app.listen(3000, ()=> {
    console.log("Server is running");

})