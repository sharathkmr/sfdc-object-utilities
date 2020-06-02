import React from 'react';
import {Nav, Navbar, Form} from 'react-bootstrap';
import './NavigationBar.css';
import axios from 'axios';
import AppContainer from './AppContainer';
import LoginComponent from './LoginComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import SpinnerCustom from './SpinnerCustom';
import config from './config';

export default class NavigationBar extends React.Component {

    constructor() {
        super();
        
        this.state = {
            objects : '',
            username : '',
            isLoading : false
        }
    }

    componentDidMount() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        // console.log(urlParams.get('tokenValidated'));
        
        if(urlParams && urlParams.get('tokenValidated')) {
            this.setState({
                username : urlParams.get('username'),
                isLoading : true
            });
            axios.get(config.endpoints.getObjectsList).then(resp => {
                let objs = [];
                // console.log(resp);
                resp.data.sobjects.forEach(obj => {
                    if(!obj.name.toLowerCase().endsWith('tag') && !obj.name.toLowerCase().endsWith('history') && !obj.name.toLowerCase().endsWith('changeevent') && !obj.name.toLowerCase().endsWith('share') && !obj.name.toLowerCase().endsWith('feed')) {
                        objs.push(obj);
                    }
                });
                
                this.setState({
                    objects : objs,
                    isLoading : false
                });
            }).catch(err => {
                // console.log(err.response);
                this.setState({
                    username : '',
                    isLoading : false
                });
            });
        }
    }

    render() {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand><b><i>{config.app_title}</i></b></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto nav-links-c">
                            <Nav.Link href={config.gitLink} target="_blank" className="github-icon-c"><FontAwesomeIcon icon={faGithub} size="lg" /></Nav.Link>
                        </Nav>
                        {this.state.username ? 
                        (<Form inline>
                            <Navbar.Text className="username-c">
                                {this.state.username ? this.state.username : ''}
                            </Navbar.Text>
                        </Form>) : ''}
                    </Navbar.Collapse>
                </Navbar>
                {this.state.objects && this.state.objects.length > 0 ? <AppContainer objs={this.state.objects} /> : (this.state.isLoading ? <SpinnerCustom /> : <LoginComponent />)}
            </div>
        );
    }
}