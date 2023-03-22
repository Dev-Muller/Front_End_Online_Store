import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import ShoppingCart from './pages/ShoppingCart';
import DetailsProduct from './pages/DetailsProduct';
import checkOut from './pages/checkOut';
import NotFound from './pages/NotFound';

function App() {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route exact path="/shoppingCart" component={ ShoppingCart } />
        <Route exact path="/detailsProduct/:id" component={ DetailsProduct } />
        <Route exact path="/checkOut" component={ checkOut } />
        <Route path="*" component={ NotFound } />
      </Switch>
    </main>
  );
}

export default App;
