import React from 'react';
import { Button, Card } from 'react-bootstrap';
import './LoginComponent.css';
import config from './config';

export default class LoginComponent extends React.Component {
    render() {
        return (
            <div className="login-container">
                <Card className="card-app-desc">
                    <Card.Body>
                        Welcome to <span className="app-title">{config.app_title}</span>.<br/>
                        Using this application you can download the list of fields for an object and objects list from salesforce org.
                    </Card.Body>
                </Card>
                <div>
                    <Button variant="success" href={config.endpoints.prod_login}>Login Into Production</Button>
                    <Button variant="primary" className="sandbox-btn" href={config.endpoints.sandbox_login}>Login Into Sandbox</Button>
                </div>
            </div>
        );
    }
}