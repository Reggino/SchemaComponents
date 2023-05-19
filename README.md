# schema-form-component

This component will render fields dynamically based on openApi schema JSON.
Default field validation with ajv is also provided within this package.


## Install
```
  npm install schema-form-component
```

## Usage
#### Schema Example:

```ts
const userSchema ={
  "properties": {
     "id":{
       "type":"string",
       "readOnly": true
     },
    "name": {
      "type": "string", 
      "minLength": 3
    },
    "dob": {
      "type": "string",
      "format": "date"
    },
    "address": {
      "type": "string",
      "maxLength": 250
    }
  },
  "required":["name"]
} 
```
```typescript jsx
    import React from 'react';
    import { SchemaForm, IFieldConfig } from "schema-form-component";

    const config:{[keyName: string]: IFieldConfig} ={
        "id":{
            hidden:true
        },
        "dob":{
            title:"Date of Birth"
        }
    }
    
    interface IUserDetailType{}
    
    const Form=()=>{
        const [userDetail,setUserDetail]= useState();
        const [errorMessages, setErrorMessages] = React.useState<TSchemaFormErrors>();
        
        const onChangeHandler= React.useCallback(
            (value:IUserDetailType , key:string)=>{
                setUserDetail(value);
                if (errorMessages) {
                    // do somehting
                }
        },[errorMessages])
        return <Form>
            <SchemaForm
                formTitle={"User Details"}
                schema={userSchema}
                onInputChange={onChangeHandler}
                value={userDetail}
                errorMessages={errorMessages}
                config={config}
            />
        </Form>
    }
    
```
## Component Props
Prop | description                                                                                                |
--- |------------------------------------------------------------------------------------------------------------|
schema | schemaObject to be rendered as a set of fields(example openapi schema).                                    |
value | Object, field value will depend on the value of the property of the object.                                |
onInputChange | change handler and will be triggered when typing in the input field.<br/> (value: T, key: string) => void. |
errorMessages | List of error messages to be shown specifically under the field.                                           |
config | custom UI config {[keyName: string]: IFieldConfig;}.                                                       |
formTitle | Provide a title for a form                                                                                 |
formButton | React Node type and it will render a buttons at the end of fields.                                         |
disableFields  | disable fields conditionally. (boolean)                                                                    |
## Config
#### you can import the type of config from the IFieldConfig.
```ts
   const config: { [keyName: string]: IFieldConfig } = {}
```