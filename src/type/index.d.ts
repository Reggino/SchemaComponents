import React from "react";
import { oas31 } from "openapi3-ts";

type TInputType =
  | "string"
  | "integer"
  | "date"
  | "date-time"
  | "boolean"
  | "array"
  | "object";
interface IFieldConfig {
  extractValue?: (
    key: string,
    val: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index?: number,
    type?: TInputType
  ) => any;
  schema?: oas31.SchemaObject;
  disabled?: boolean;
  hidden?: boolean;
  component?: string;
  style?: React.CSSProperties;
  inputType?: "select" | "input" | "date";
  options?: { [key: string]: string }[];
  isUrl?: boolean;
}
