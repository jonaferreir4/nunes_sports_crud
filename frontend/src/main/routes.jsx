import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from '../components/home/home'
import UserCrud from '../components/user/userCrud'
import ProductCrud from '../components/product/productCrud'


export default props =>
    <Routes>
        <Route exact path='/' Component={Home} />
        <Route path='/users' Component={UserCrud} />
        <Route path='/products' Component={ProductCrud} />
        <Route path='*' Component={Home} />
    </Routes>