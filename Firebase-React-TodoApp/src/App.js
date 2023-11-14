import React from 'react';

// import Header from './components/Header';
// import Carousel from './components/Carousel';
// import Advt from './components/Advt';
// import Footer from './components/Footer';
// import ProductList from './components/ProductList';
// import Product from './components/Product';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Cart from './components/Cart';
// import Error from './components/Error';
// import ContactUs from './components/ContactUs';
// import SocialLogin from './components/SocialLogin';
// import Login from './firebase/Login';
// import SignUp from './firebase/SignUp';
// import Chat from './firebase/Chat';
import Login from './todoApp/Login';
import ResponsiveDrawer from './todoApp/ResponsiveDrawer';


function App() {


  return (
    <div className='container-fluid'>

     
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='todos/:id' element={ <ResponsiveDrawer/>} />
        </Routes>
      </Router>

     
    </div>
  )
}

export default App;