export default {
    app_title : 'Salesforce Object Utilities',
    gitLink : 'https://github.com/sharathkmr/sfdc-object-utilities',
    endpoints : {
        getObjectsList : '/api/objectsList',
        prod_login : '/auth/login?target=production',
        sandbox_login : '/auth/login?target=sandbox',
        object_describe : '/api/sobject/describe',
        tooling_query : '/api/toolingQuery'
    },
    csv : {
        header : {'API Name':'QualifiedApiName', 'NameSpace Prefix':'NamespacePrefix', 'Label':'Label', 'Created Date':'CreatedDate', 'Last Modified Date':'LastModifiedDate','LastModifiedBy.Name':'LastModifiedBy.Name', 'Object API Name':'EntityDefinition.QualifiedApiName', 'Object Id':'EntityDefinition.DurableId'}
    },
    queries : {
        fieldDefinition : 'SELECT Label, QualifiedApiName, DeveloperName, LastModifiedDate, LastModifiedById, LastModifiedBy.Name, EntityDefinition.DurableId, EntityDefinition.QualifiedApiName, NamespacePrefix FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName = ',
        customField : 'SELECT NameSpacePrefix, DeveloperName, TableEnumOrId, CreatedDate, LastModifiedDate FROM CustomField WHERE TableEnumOrId = '
    },
    detailSyncFields : ['CreatedDate', 'DeveloperName', 'LastModifiedDate', 'NamespacePrefix', 'TableEnumOrId']
}