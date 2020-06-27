import React from 'react';
import './AppContainer.css';
import { Container, Col, Form, Row, Button } from 'react-bootstrap';
import ObjectDetails from './ObjectDetails';
import ObjectMetadata from './ObjectMetadata';
import {convertToCSV, dowloadDocument} from './utils/CommonUtils';
import config from './config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export default class AppContainer extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            objData : this.props.objs,
            objectsDisplayed : this.props.objs,
            selectedObj : '',
            standardObjects : true,
            customObjects : true,
            customSettings : true
        }
    }

    onObjectSelect = (e) => {
        this.setState({
            selectedObj : e.target.value
        });
    }

    standardObjectSwitch = (e) => {
        let objectsDisplayed = this.state.objData.filter((obj) => {
            return (!obj.custom === e.target.checked);
        });
        this.setState({
            standardObjects : e.target.checked,
            objectsDisplayed : objectsDisplayed
        });
    }

    customObjectSwitch = (e) => {
        let objectsDisplayed = this.state.objData.filter((obj) => {
            return (obj.custom === e.target.checked);
        });
        this.setState({
            customObjects : e.target.checked,
            objectsDisplayed : objectsDisplayed
        });
    }

    customSettingsSwitch = (e) => {
        let objectsDisplayed = this.state.objData.filter((obj) => {
            return (obj.customSetting === e.target.checked);
        });
        this.setState({
            customSettings : e.target.checked,
            objectsDisplayed : objectsDisplayed
        });
    }

    downloadObjectsData = (e) => {

        if(!this.state.objData || (this.state.objData && this.state.objData.length === 0)) {
            return;
        }

        const csvFields = new Map(Object.entries(config.csv.objectHeader));
        //console.log('csvFields: ', csvFields);
        dowloadDocument('Objects List', convertToCSV(this.state.objData, csvFields));
    }

    render() {
        return (
            <div className="app-container">
                <Container>
                    <Form>
                        <Row>
                            <Col sm={4}>
                                <Form.Group controlId="exampleForm.SelectCustomSizeLg">
                                    <Form.Label>Object</Form.Label>
                                    <Form.Control as="select" size="sm" custom onChange={this.onObjectSelect}>
                                        <option>-- None --</option>
                                        {this.state.objectsDisplayed && this.state.objectsDisplayed.length > 0 ? this.state.objectsDisplayed.map(obj => <option key={obj.name}>{obj.name}</option> ) : ''}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                                <Form.Check type="switch" id="switch-standard-objs" label="Standard Objects" onClick={this.standardObjectSwitch} checked={this.state.standardObjects}/>
                            </Col>
                            <Col sm={2}>
                                <Form.Check type="switch" id="switch-custom-objs" label="Custom Objects" onClick={this.customObjectSwitch} checked={this.state.customObjects} />
                            </Col>
                            <Col sm={2}>
                                <Form.Check type="switch" id="switch-custom-settings" label="Custom Settings" onClick={this.customSettingsSwitch} checked={this.state.customSettings} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Button className="btn-objs-list" variant="outline-info" size="sm" onClick={this.downloadObjectsData}><FontAwesomeIcon icon={faDownload} size="lg" /> Objects List</Button>
                            </Col>
                        </Row>
                    </Form>
                    <ObjectMetadata object={this.state.selectedObj} />
                    <ObjectDetails object={this.state.selectedObj} />
                </Container>
            </div>
        );
    }
}