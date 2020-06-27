import React from 'react';
import { Card, Form, Col, Spinner } from 'react-bootstrap';
import './ObjectMetadata.css';
import config from './config';
import axios from 'axios';

export default class ObjectMetadata extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            metadata: {},
            sobject: this.props.object,
            isLoading : false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.sobject !== nextProps.object) {
            this.setState({
                sobject: nextProps.object,
                isLoading : true
            });
        }
        this.getObjectDetails(nextProps.object);
    }

    checkCustomMetadata = (api_name) => {
        if(api_name && api_name.toLowerCase().endsWith('__mdt')) {
            return true;
        } else {
            return false;
        }
    }

    getObjectDetails = (objectName) => {
        axios.get(config.endpoints.object_describe, {
            params: {
                sobject: objectName
            }
        }).then(resp => {
            let metadata = resp.data;
            metadata.is_customMetadata = this.checkCustomMetadata(metadata.name);
            // console.log('metadata: ',metadata);
            this.setState({
                metadata : metadata,
                isLoading : false
            });
        }).catch(err => {
            // console.log(err);
            this.setState({
                metadata : {},
                isLoading : false
            });
        });
    }

    render() {
        return (
            <Card className="card-c">
                <Card.Body className="card-body-c">
                    {this.state.isLoading ? <Spinner animation="border" size="lg" /> :
                    this.state.metadata.label ? <Form>
                        <Form.Row>
                            <Col>
                                <Form.Label className="header-custom">Object Name</Form.Label>
                                <p>{this.state.metadata.label}</p>
                            </Col>
                            <Col>
                                <Form.Label className="header-custom">Object API Name</Form.Label>
                                <p>{this.state.metadata.name}</p>
                            </Col>
                            <Col>
                                <Form.Label className="header-custom">Total Fields</Form.Label>
                                <p>{this.state.metadata.fields ? this.state.metadata.fields.length : ''}</p>
                            </Col>
                            <Col>
                            <Form.Label className="header-custom">Object Prefix</Form.Label>
                                <p>{this.state.metadata.keyPrefix}</p>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Check custom inline disabled label="Standard Object" type="checkbox" checked={!this.state.metadata.custom} id="standard-object" />
                            </Col>
                            <Col>
                                <Form.Check custom inline disabled label="Custom Object" type="checkbox" checked={this.state.metadata.custom} id="custom-object" />
                            </Col>
                            <Col>
                                <Form.Check custom inline disabled label="Custom Settings" type="checkbox" checked={this.state.metadata.customSetting} id="custom-settings" />
                            </Col>
                            <Col>
                                <Form.Check custom inline disabled label="Custom Metadata" type="checkbox" checked={this.state.metadata.is_customMetadata} id="custom-metadata" />
                            </Col>
                        </Form.Row>
                    </Form>: ''}
                </Card.Body>
            </Card>
        );
    }
}