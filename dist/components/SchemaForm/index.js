import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { getEmptyObject } from "../../inc/schema";
import { camelTextToTitleText } from "../../inc/string";
import DatePicker from "react-datepicker";
import nl from "date-fns/locale/nl";
import linkIcon from "../../icons/linkIcon.svg";
import "react-datepicker/dist/react-datepicker.css";
import { format as formatDate } from 'date-fns';
import "./index.scss";
const defaultDateFormat = "dd-MM-yyyy";
export default function SchemaForm(props) {
    const { onInputChange, schema, errorMessages = {}, value, config, disableFields, formTitle, formButton, } = props;
    const { properties = {}, required = [] } = schema;
    const getStringField = React.useCallback((title, key, schemaObject, propValue, errorMessage, configProps) => {
        const onStringInputChange = (e) => {
            onInputChange(Object.assign(Object.assign({}, value), { [key]: (configProps === null || configProps === void 0 ? void 0 : configProps.extractValue)
                    ? configProps.extractValue(key, e)
                    : e.target.value }), key);
        };
        const { format, readOnly, enum: enumItems, maxLength } = schemaObject;
        if (format === "date" || format === "date-time") {
            return (_jsx(DatePicker, { dateFormat: (configProps === null || configProps === void 0 ? void 0 : configProps.dateFormat) || defaultDateFormat, locale: nl, selected: propValue
                    ? new Date(propValue)
                    : new Date(), onChange: (date) => onInputChange(Object.assign(Object.assign({}, value), { [key]: date ? formatDate(date, (configProps === null || configProps === void 0 ? void 0 : configProps.dateFormat) || defaultDateFormat) : '' }), key), disabled: readOnly || disableFields }));
        }
        if (maxLength && maxLength > 100) {
            return (_jsx("textarea", { className: errorMessage ? "input-error" : "", placeholder: `Enter ${title}`, disabled: disableFields || readOnly, value: propValue || "", rows: 6, onChange: onStringInputChange }));
        }
        if ((configProps === null || configProps === void 0 ? void 0 : configProps.inputType) === "select" || enumItems) {
            return (_jsxs("select", Object.assign({ className: errorMessage ? "input-error" : "", value: propValue, onChange: onStringInputChange, disabled: disableFields || readOnly }, { children: [_jsxs("option", Object.assign({ value: "default-option" }, { children: ["Select ", camelTextToTitleText(key)] }), "default-option"), ((configProps && (configProps === null || configProps === void 0 ? void 0 : configProps.options)
                        ? configProps.options
                        : enumItems) || []).map((item) => {
                        const itemKey = Object.keys(item);
                        let id = typeof item === "object" ? item[itemKey[0]] : item;
                        let name = typeof item === "object" ? item[itemKey[1]] : item;
                        return (_jsx("option", Object.assign({ value: name }, { children: name }), id));
                    })] })));
        }
        return (_jsx("input", { className: errorMessage ? "input-error" : "", type: (configProps === null || configProps === void 0 ? void 0 : configProps.format) === "url" ? "url" : "text", placeholder: `Enter ${title}`, disabled: disableFields || readOnly, value: propValue || "", onChange: onStringInputChange }));
    }, [disableFields, onInputChange, value]);
    const getIntegerField = React.useCallback((title, key, propValue, readOnly, minNumber) => {
        return (_jsx("input", { type: "number", className: ``, placeholder: `Enter ${title}`, disabled: disableFields || readOnly, value: propValue || "", min: minNumber, onChange: (e) => onInputChange(Object.assign(Object.assign({}, value), { [key]: parseInt(e.target.value) }), key) }));
    }, [disableFields, onInputChange, value]);
    const getComponent = React.useCallback((schemaObj, key, title, index, propValue, errorMessage, configProps) => {
        var _a, _b;
        const { readOnly, minimum } = schemaObj;
        switch (schemaObj.type) {
            case "string":
                return getStringField(title, key, schemaObj, propValue || "", errorMessage, configProps);
            case "integer":
                return getIntegerField(title, key, propValue || "", readOnly, minimum);
            case "array":
                const splitKey = key.split("/");
                const propKeyName = splitKey[splitKey.length - 1];
                const fieldSchema = (_b = (_a = configProps === null || configProps === void 0 ? void 0 : configProps.schema) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b[propKeyName];
                switch (fieldSchema === null || fieldSchema === void 0 ? void 0 : fieldSchema.type) {
                    case "string":
                        return getStringField(camelTextToTitleText(propKeyName), key, fieldSchema, propValue || "", errorMessage, configProps);
                    case "integer":
                        return getIntegerField(title, key, propValue || "", readOnly, minimum);
                }
                break;
            default:
                throw new Error("Unsupported schema");
        }
    }, [getIntegerField, getStringField]);
    return (_jsx("div", Object.assign({ className: "schema-form-container" }, { children: _jsxs("div", Object.assign({ className: `schema-form` }, { children: [_jsx("div", Object.assign({ className: "page-title my-1 mx-sm-1" }, { children: formTitle })), Object.keys(properties)
                    .filter((el) => el !== "")
                    .map((keyName, index) => {
                    var _a;
                    // @ts-ignore
                    const schemaObj = ((_a = schema.properties) === null || _a === void 0 ? void 0 : _a[keyName]) || getEmptyObject(schema);
                    const title = camelTextToTitleText(keyName);
                    const isRequired = required.indexOf(keyName) !== -1;
                    const errorMessage = errorMessages[keyName];
                    const propValue = value ? value[keyName] : undefined;
                    const propConfig = config ? config[keyName] : undefined;
                    if (propConfig === null || propConfig === void 0 ? void 0 : propConfig.hidden) {
                        return null;
                    }
                    return (_jsxs("div", Object.assign({ className: `item` }, { children: [_jsxs("div", Object.assign({ className: `item-title` }, { children: [(schemaObj === null || schemaObj === void 0 ? void 0 : schemaObj.title) || title, _jsx("span", Object.assign({ className: "required-star-icon" }, { children: isRequired && keyName !== "Action" ? " *" : "" }))] })), _jsxs("div", Object.assign({ className: "item-component" }, { children: [_jsxs("div", Object.assign({ className: "row" }, { children: [getComponent(schemaObj, keyName, title, index, propValue, errorMessage, propConfig), (propConfig === null || propConfig === void 0 ? void 0 : propConfig.format) === "url" && propValue ? (_jsx("img", { className: "icon-button", alt: "link icon", src: linkIcon, width: "30", height: "23", onClick: () => {
                                                    window.open(propValue, "_blank");
                                                } })) : null] })), errorMessage ? (_jsx("div", Object.assign({ className: "errorMessage" }, { children: errorMessage }))) : null] }))] }), index));
                }), formButton] })) })));
}
