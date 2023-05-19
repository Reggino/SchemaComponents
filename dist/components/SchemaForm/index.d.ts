import { ReactNode } from "react";
import { oas31 } from "openapi3-ts";
import "react-datepicker/dist/react-datepicker.css";
import { IFieldConfig } from "../../type/field";
import "./index.scss";
type ISchemaFormProps<T> = {
    schema: oas31.SchemaObject;
    value: T;
    onInputChange: (value: T, key: string) => void;
    errorMessages?: any;
    config?: {
        [keyName: string]: IFieldConfig;
    };
    disableFields?: boolean;
    formTitle?: string;
    formButton?: ReactNode;
};
export default function NewSchemaForm<T>(props: ISchemaFormProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
