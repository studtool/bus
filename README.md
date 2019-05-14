# Simple event bus with powerfull debugging tools

## Installation

`npm i --save bus-graph`

## Example 

```js
const Bus = require('bus-graph');

// callback functions for events
function callbackFirst(data){
    console.log(data);
}

function callbackSecond(data){
    console.log("++", data);
}

// simple example
Bus.on("FirstEvent", callbackFirst)

Bus.emit({
    event: "FirstEvent", 
    data: [1,2,3,4]
})


// example with suscription and emittion in nested functions
function higher(){
    function inner(){
        Bus.on("SecondEvent", callbackSecond);  
    }
    inner();
}
higher();

function higherEmitter(){
    function innerEmitter(){
        Bus.emit({
            event: "SecondEvent", 
            data: [1,2,3,4, 5,6]
        });
    }
    innerEmitter();
}

higherEmitter();

let meta = Bus.getMeta();

console.log(meta);
```

### Result

```
[ 1, 2, 3, 4 ]
++ [ 1, 2, 3, 4, 5, 6 ]
{ FirstEvent:
   [ { from: undefined,
       link: '(/path_to_caller_file/index.js:13:5)',
       event: 'FirstEvent',
       callback: 'callbackFirst',
       data: undefined },
     { from: undefined,
       link: '(/path_to_caller_file/index.js:15:5)',
       event: 'FirstEvent',
       callback: undefined,
       data: [Array] } ],
  SecondEvent:
   [ { from: 'inner',
       link: '(/path_to_caller_file/index.js:24:13)',
       event: 'SecondEvent',
       callback: 'callbackSecond',
       data: undefined },
     { from: 'innerEmitter',
       link: '(/path_to_caller_file/index.js:32:13)',
       event: 'SecondEvent',
       callback: undefined,
       data: [Array] } ] }
```

## Turn off debug

```js
const Bus = require('bus-graph');

Bus.setDebug(false); // turn's off debug

// turn on debug
Bus.setDebug(true);
Bus.setDebug();
```
