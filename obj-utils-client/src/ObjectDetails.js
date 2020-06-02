import React from 'react';
import './ObjectDetails.css';
import { Table, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import SpinnerCustom from './SpinnerCustom';
import config from './config';

export default class ObjectDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            object: this.props.selectedObj,
            objectDetails: [],
            csvHeader : config.csv.header,
            csvLoading : false,
            isLoading : false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.object !== nextProps.object) {
            this.setState({
                object: nextProps.object,
                isLoading : true
            });
            this.fetchObjectDetails(nextProps.object);
        }
    }

    fetchObjectDetails(objName) {
        // let customFields = config.detailSyncFields;
        let queries = [];
        queries.push(config.queries.fieldDefinition+'\''+objName +'\'');
        queries.push(config.queries.customField);
        
        axios.get(config.endpoints.tooling_query, {
            params: {
                soqlQueries: queries,
                sobject: objName
            }
        }).then(resp => {
            let resData = resp;
            // console.log(resData);
            let objData = new Map();
            
            for (let rec of resData.data.fieldDef.records) {
                objData.set(rec.QualifiedApiName, rec);
            }

            for (let rec of resData.data.fieldDetails.records) {
                let fieldApiName = rec.DeveloperName + '__c';
                if (rec.NamespacePrefix) {
                    fieldApiName = rec.NamespacePrefix + '__' + rec.DeveloperName + '__c';
                }
                
                if (objData.has(fieldApiName)) {
                    for (let field of config.detailSyncFields) {
                        objData.get(fieldApiName)[field] = rec[field];
                    }
                }
            }
            
            this.setState({
                objectDetails: Array.from(objData.values()),
                isLoading : false
            });
        }).catch(err => {
            // console.log(err);
            this.setState({
                objectDetails : [],
                isLoading : false
            });
        });
    }

    downloadObjectDetails = (e) => {
        
        this.setState({
            csvLoading : true
        });

        if(!this.state.objectDetails || (this.state.objectDetails && this.state.objectDetails.length === 0)) {
            return;
        }
        
        const csvFields = new Map(Object.entries(this.state.csvHeader));
        console.log('csvFields: ', csvFields);
        var csv = this.convertToCSV(this.state.objectDetails, csvFields);

        // create a DOM element to download the csv content
        var csvElement = document.createElement('a');
        var universalBOM = "\uFEFF"; // Universal BOM (Byte Order Mark)
        csvElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(universalBOM+csv);
        csvElement.target = '_self';
        let todayDate = new Date();
        let csvDate = (todayDate.getMonth()+1)+'-'+todayDate.getDate()+'-'+todayDate.getFullYear();
        csvElement.download = this.state.objectDetails[0].EntityDefinition.QualifiedApiName+'_'+this.state.objectDetails[0].EntityDefinition.DurableId+'_'+csvDate+'.csv';
        document.body.appendChild(csvElement);
        csvElement.click();

        this.setState({
            csvLoading : false
        });
    }

    convertToCSV = (recs, headersMap) => {
        var csvRes, counter, keys;
        var colDivider = ',';
        var lineDivider = '\n';

        if (recs == null || !recs.length) {
            return null;
        }
        keys = Array.from(headersMap.keys());
        
        csvRes = '';
        csvRes += keys.join(colDivider);
        csvRes += lineDivider;

        for (var i = 0; i < recs.length; i++) {
            counter = 0;

            for (var tempKey of keys) {
                let skey = headersMap.get(tempKey);
                
                if (counter > 0) {
                    csvRes += colDivider;
                }
                
                let fieldValue;

                if(skey.includes('.') > 0) {
                    let fields = skey.split('.');
                    let obj = recs[i][fields[0]]
                    
                    if(obj) {
                        fieldValue = obj[fields[1]];
                    } else  {
                        fieldValue = null;
                    }
                } else {
                    fieldValue = recs[i][skey];
                }
                
                // Exclude if the [ROW][COL] is a object
                if (typeof fieldValue == 'object' || fieldValue === undefined || fieldValue === null) {
                    csvRes += '""';
                } else {
                    csvRes += '"' + fieldValue + '"';
                }
                counter++;
            }
            csvRes += lineDivider;
        }
        return csvRes;
    }

    render() {
        return (
            <div>
                { this.state.isLoading ? <SpinnerCustom /> :
                    (this.state.objectDetails && this.state.objectDetails.length > 0 ? <div className="div-container">
                        <div className="btn-loading-c">
                        {this.state.csvLoading ? <Spinner animation="border" size="sm" />:<button onClick={this.downloadObjectDetails} className="btn-download-c"><FontAwesomeIcon icon={faDownload} size="lg"/></button>}
                        </div>
                        <Table striped bordered hover size="sm" className="table-c">
                            <thead>
                                <tr>
                                    <th>Label</th>
                                    <th>Namespace</th>
                                    <th>API Name</th>
                                    <th>Created Date</th>
                                    <th>Last Modified Date</th>
                                    <th>Last Modified Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.objectDetails && this.state.objectDetails.length > 0 ? this.state.objectDetails.map(obj =>
                                    <tr key={obj.QualifiedApiName}>
                                        <td>{obj.Label}</td>
                                        <td>{obj.NamespacePrefix}</td>
                                        <td>{obj.QualifiedApiName}</td>
                                        <td className="td-CreatedDate">{obj.CreatedDate}</td>
                                        <td className="td-LastModifiedDate">{obj.LastModifiedDate}</td>
                                        <td>{obj.LastModifiedBy ? obj.LastModifiedBy.Name : ''}</td>
                                    </tr>
                                ): ''}
                            </tbody>
                        </Table>
                    </div> : '')
                }
            </div>
        );
    }
}