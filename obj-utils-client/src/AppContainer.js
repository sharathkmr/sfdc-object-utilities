import React from 'react';
import './AppContainer.css';
import { Container, Col, Form, Row } from 'react-bootstrap';
import ObjectDetails from './ObjectDetails';
import ObjectMetadata from './ObjectMetadata';

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
                                        <option>--none--</option>
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
                    </Form>
                    <ObjectMetadata object={this.state.selectedObj} />
                    <ObjectDetails object={this.state.selectedObj} />
                </Container>
            </div>
        );
    }
}