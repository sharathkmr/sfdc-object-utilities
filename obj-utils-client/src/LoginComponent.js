import React from 'react';
import { Button } from 'react-bootstrap';
import './LoginComponent.css';
import config from './config';

export default class LoginComponent extends React.Component {
    render() {
        return (
            <div className="login-container">
                <Button variant="success" href={config.endpoints.prod_login}>Login Into Production</Button>
                <Button variant="primary" className="sandbox-btn" href={config.endpoints.sandbox_login}>Login Into Sandbox</Button>
            </div>
        );
    }
}