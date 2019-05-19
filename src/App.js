import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import GraphHandler from './GraphHandler';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          
          <GraphHandler />
        </header>
      </div>
    </ApolloProvider>
  );
}




export default App;
