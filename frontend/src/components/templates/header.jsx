import './header.css'
import React from 'react'

export default props =>
    <header className="header d-none d-sm-flex" >
        <h1 className="mt-3 text-center ">
            <i className={`fa fa-${props.icon} `} ></i> {props.title} -
            <span className='display-8 text-muted' style={{fontSize: 24}}> {props.subtitle}</span>
        </h1>
    </header>