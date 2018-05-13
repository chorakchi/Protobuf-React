import React, { Component } from 'react';
import { load } from "protobufjs";
import './App.css';
import awesomProto from './awesome.proto'

class App extends Component {
  componentDidMount(){
    load(awesomProto, function(err, root) {
      if (err)
        throw err;
    
      // example code
      const AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");
    
      let message = AwesomeMessage.create({ awesomeField: "hello" });
      console.log(`message = ${JSON.stringify(message)}`);
    
      let buffer = AwesomeMessage.encode(message).finish();
      console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);
    
      let decoded = AwesomeMessage.decode(buffer);
      console.log(`decoded = ${JSON.stringify(decoded)}`);
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
           Get start with Protobufjs in React.
        </p>
      </div>
    );
  }
}

export default App;
