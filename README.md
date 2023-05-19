# schema-form-component

This component will render set of fields based on openApi schema JSON.
Default field validation with ajv is also provided within this package.


## Install
```
  npm install schema-form-component
```

### Usage
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
    import { SchemaForm, IFieldConfig,TSchemaFormErrors } from "schema-form-component";

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
