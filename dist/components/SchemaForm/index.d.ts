import React, { ReactNode } from "react";
import { oas31 } from "openapi3-ts";
import "react-datepicker/dist/react-datepicker.css";
import "./index.scss";
export type TInputType = "string" | "integer" | "date" | "date-time" | "boolean" | "array" | "object";
export interface IFieldConfig {
    extractValue?: (key: string, val: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, index?: number, type?: TInputType) => any;
    schema?: oas31.SchemaObject;
    disabled?: boolean;
    hidden?: boolean;
    component?: string;
    style?: React.CSSProperties;
    inputType?: "select" | "input" | "date";
    options?: {
        [key: string]: string;
    }[];
    isUrl?: boolean;
}
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
