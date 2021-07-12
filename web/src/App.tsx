import "./App.css";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Coming from "./components/Coming";
import Home from "./pages/Home";
import IsAuthenticated from "./components/IsAuthenticated";
import Landing from "./pages/Landing";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import React from "react";
import Signup from "./pages/Signup";
import SinglePost from "./pages/SinglePost";
import SingleUser from "./pages/SingleUser";
import { setContext } from "apollo-link-context";

const httpLink = new HttpLink({ uri: "http://localhost:4000" });
const authLink = setContext(async (_req, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    ...headers,
    headers: { Authorization: token ? `Bearer ${token}` : null },
  };
});
const link = authLink.concat(httpLink as any);

const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/landing">
            <Landing />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <IsAuthenticated>
            <Layout>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/post/:id">
                <SinglePost />
              </Route>
              <Route path="/user/:id">
                <SingleUser />
              </Route>
              <Route path="/coming">
                <Coming />
              </Route>
            </Layout>
          </IsAuthenticated>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
