import React from 'react';
import { Spinner } from 'react-bootstrap';
import './SpinnerCustom.css';

export default class SpinnerCustom extends React.Component {

    render() {
        return (
            <div className="spinner-container">
                <Spinner animation="grow" variant="danger" className="spinner-c" /><Spinner animation="grow" variant="success" className="spinner-c"/><Spinner animation="grow" variant="primary" />
            </div>
        );
    }

}