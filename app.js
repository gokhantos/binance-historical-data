'use strict';
var ccxt = require ('ccxt');
var fs = require('fs');
const { type } = require('os');
(async function () {     
    const exchangeId = 'binance',  
    exchangeClass = ccxt[exchangeId],  
    exchange = new exchangeClass ({             
        'apiKey': '3OewqSL5SLEFn8MyqB5FzFlSz4ID4UQirj5DN2dTwIpLRuPURSHSVMqbxAgp63UP',        
        'secret': 'uRkMdDR0nlkrAJkuN1bgN4hEarfO1l2gP0qliam4EPRpY2Dei3jydwzoDYk4DM5I',        
        'timeout': 30000, 
        'enableRateLimit': true,         
    })        
 var ohlcv = [];
    async function get_historical_data(exchange_name, timechart){ 
        var timestamp = new Date("01/01/2018").getTime();         
        var exchange_time = await exchange.milliseconds();   
        exchange_name2 = exchange_name.replace('/', ''); 
        var filename = exchange_name2 + '-' + timechart; 
        try{ 
            var myJSON = importJSON(filename); 
            var time_length = exchange_time - myJSON[myJSON.length-1][0];   
            if(myJSON[myJSON.length-1][0] < exchange_time){ 
                timestamp = myJSON[myJSON.length -1][0]; 
                while(timestamp < exchange_time){ 
                    var my_data = await exchange.fetchOHLCV(exchange_name, timechart, timestamp); 
                    myJSON.push(...my_data); 
                    timestamp += time_length; 
                } 
                exportToJSON(myJSON, filename); 
            } }catch{ 
                { 
                ohlcv = await exchange.fetchOHLCV(exchange_name, timechart ,timestamp);         
                var time_length = ohlcv[ohlcv.length-1][0] - ohlcv[0][0];         
                while(timestamp < exchange_time){             
                    var my_data = await exchange.fetchOHLCV(exchange_name, timechart, timestamp);             
                    ohlcv.push(...my_data);             
                    timestamp += time_length;         
                } 
                console.log(ohlcv); 
                exportToJSON(ohlcv, filename); 
            } 
        } 
    }    
    function exportToJSON(array, filename){         
        if(!array.length) return;         
        var myJSON = JSON.stringify(array);         
        fs.writeFile( __dirname + '/data/' + filename + '.json' ,myJSON, 'utf8', function (err){
                if(err){                 
                    return console.log(err);       
                }             
            console.log(filename + ' was saved');         
        });     
    } 
    function importJSON(filename){ 
        var myJSON = fs.readFileSync( __dirname + '/data/' + filename + '.json'); 
        myJSON = JSON.parse(myJSON); 
        return myJSON; 
    }    
    
    //get_historical_data('ETH/USDT', '1h');
    async function get_markets(){
        var markets_data = await exchange.loadMarkets();
        var markets_list = [];
        for(var key in markets_data){
            if(((key.split('/').includes('USDT')) == true) || (key.split('/').includes('BTC')) == true){
                markets_list.push(key);
            }
        }
        return markets_list;
    }
    var market_list = await get_markets();
    // var time_interval = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];
    // console.log(market_list[0]);
    // for(var i=0;i<market_list.length;i++){
    //     await get_historical_data(market_list[i],time_interval[5]);
    // }
    console.log(market_list.length);

}) ();