import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import Home from './Home.jsx';

export default () => {
  return (
    <BrowserRouter basename='/' forceRefresh={false}>
      <Container>
        <Switch>
          <Route exact path='/' component={Home} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};
