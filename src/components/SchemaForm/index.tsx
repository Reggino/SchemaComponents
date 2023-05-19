import React, { ReactNode } from "react";
import { oas31 } from "openapi3-ts";
import { getEmptyObject } from "../../inc/schema";
import { camelTextToTitleText } from "../../inc/string";
import DatePicker from "react-datepicker";
import nl from "date-fns/locale/nl";
import linkIcon from "../../icons/linkIcon.svg";
import { IFieldConfig } from "../../type";
import "react-datepicker/dist/react-datepicker.css";
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

export default function NewSchemaForm<T>(props: ISchemaFormProps<T>) {
  const {
    onInputChange,
    schema,
    errorMessages = {},
    value,
    config,
    disableFields,
    formTitle,
    formButton,
  } = props;
  const { properties = {}, required = [] } = schema;

  const getStringField = React.useCallback(
    (
      title: string,
      key: string,
      schemaObject: oas31.SchemaObject,
      propValue: string,
      errorMessage?: string,
      configProps?: IFieldConfig
    ) => {
      const onStringInputChange = (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      ) => {
        onInputChange(
          {
            ...value,
            [key]: configProps?.extractValue
              ? configProps.extractValue(key, e)
              : e.target.value,
          },
          key
        );
      };
      const { format, readOnly, enum: enumItems, maxLength } = schemaObject;

      if (format === "date" || format === "date-time") {
        return (
          <DatePicker
            dateFormat="dd MMM yyyy"
            locale={nl}
            selected={
              propValue
                ? new Date(propValue as "date" | "date-time")
                : new Date()
            }
            onChange={() => {}}
            disabled={readOnly || disableFields}
          />
        );
      }

      if (maxLength && maxLength > 100) {
        return (
          <textarea
            className={errorMessage ? "input-error" : ""}
            placeholder={`Enter ${title}`}
            disabled={disableFields || readOnly}
            value={propValue || ""}
            rows={6}
            onChange={onStringInputChange}
          />
        );
      }

      if (configProps?.inputType === "select" || enumItems) {
        return (
          <select
            className={errorMessage ? "input-error" : ""}
            value={propValue}
            onChange={onStringInputChange}
            disabled={disableFields || readOnly}
          >
            <option key={"default-option"} value={"default-option"}>
              Select {camelTextToTitleText(key)}
            </option>
            {(
              (configProps && configProps?.options
                ? configProps.options
                : enumItems) || []
            ).map((item: string | { [optionKey: string]: string }) => {
              const itemKey = Object.keys(item);
              let id = typeof item === "object" ? item[itemKey[0]] : item;
              let name = typeof item === "object" ? item[itemKey[1]] : item;
              return (
                <option key={id} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
        );
      }
      return (
        <input
          className={errorMessage ? "input-error" : ""}
          placeholder={`Enter ${title}`}
          disabled={disableFields || readOnly}
          value={propValue || ""}
          onChange={onStringInputChange}
        />
      );
    },
    [disableFields, onInputChange, value]
  );

  const getIntegerField = React.useCallback(
    (
      title: string,
      key: string,
      propValue: string,
      readOnly?: boolean,
      minNumber?: number
    ) => {
      return (
        <input
          type={"number"}
          className={``}
          placeholder={`Enter ${title}`}
          disabled={disableFields || readOnly}
          value={propValue || ""}
          min={minNumber}
          onChange={(e) =>
            onInputChange(
              {
                ...value,
                [key]: parseInt(e.target.value),
              },
              key
            )
          }
        />
      );
    },
    [disableFields, onInputChange, value]
  );

  const getComponent = React.useCallback(
    (
      schemaObj: oas31.SchemaObject,
      key: string,
      title: string,
      index: number,
      propValue?: string,
      errorMessage?: string,
      configProps?: IFieldConfig
    ) => {
      const { readOnly, minimum } = schemaObj;
      switch (schemaObj.type) {
        case "string":
          return getStringField(
            title,
            key,
            schemaObj,
            propValue || "",
            errorMessage
          );
        case "integer":
          return getIntegerField(
            title,
            key,
            propValue || "",
            readOnly,
            minimum
          );
        case "array":
          const splitKey = key.split("/");
          const propKeyName = splitKey[splitKey.length - 1];
          const fieldSchema = configProps?.schema?.properties?.[
            propKeyName
          ] as oas31.SchemaObject;
          switch (fieldSchema?.type) {
            case "string":
              return getStringField(
                camelTextToTitleText(propKeyName),
                key,
                fieldSchema,
                propValue || "",
                errorMessage,
                configProps
              );
            case "integer":
              return getIntegerField(
                title,
                key,
                propValue || "",
                readOnly,
                minimum
              );
          }
          break;
        default:
          console.log(schemaObj);
          throw new Error("Unsupported schema");
      }
    },
    [getIntegerField, getStringField]
  );

  return (
    <div className={"schema-form-container"}>
      <div className={`schema-form`}>
        <div className={"page-title my-1 mx-sm-1"}>{formTitle}</div>
        {Object.keys(properties)
          .filter((el) => el !== "")
          .map((keyName, index) => {
            // @ts-ignore
            const schemaObj: oas31.SchemaObject =
              schema.properties?.[keyName] || getEmptyObject(schema);
            const title = camelTextToTitleText(keyName);
            const isRequired = required.indexOf(keyName) !== -1;
            const errorMessage = errorMessages[keyName] as string | undefined;
            const propValue = value ? (value as any)[keyName] : undefined;
            const propConfig = config ? config[keyName] : undefined;

            if (propConfig?.hidden) {
              return null;
            }
            return (
              <div className={`item`} key={index}>
                <div className={`item-title`}>
                  {schemaObj?.title || title}
                  <span className={"required-star-icon"}>
                    {isRequired && keyName !== "Action" ? " *" : ""}
                  </span>
                </div>
                <div className={"item-component"}>
                  <div className={"row"}>
                    {getComponent(
                      schemaObj,
                      keyName,
                      title,
                      index,
                      propValue,
                      errorMessage
                    )}
                    {propConfig?.isUrl ? (
                      <img
                        className={"icon-button"}
                        alt={"link icon"}
                        src={linkIcon}
                        width="30"
                        height="23"
                        onClick={() => {
                          window.open(propValue, "_blank");
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  {errorMessage ? (
                    <div className={"errorMessage"}>{errorMessage}</div>
                  ) : null}
                </div>
              </div>
            );
          })}
        {formButton}
      </div>
    </div>
  );
}
