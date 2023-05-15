import React from "react";
import { oas31 } from "openapi3-ts";
import { VariableSizeGrid, VariableSizeList } from "react-window";
import { camelTextToTitleText } from "../../../inc/string";
import plusIcon from "../../../styles/Icon/plusIcon.svg";
import trashIcon from "../../../styles/Icon/trashIcon.svg";
import DatePicker from "react-datepicker";
import { getEmptyObject } from "../../../inc/schema";

export interface IListComponentFieldConfig {
    extractValue?: (
        key: string,
        val: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => any;
    disabled?: boolean;
    hidden?: boolean;
    component?: string;
    style?: React.CSSProperties;
    options?: { [key: string]: string | boolean }[];
    width?: number;
    title?: string;
}
interface IProps<T> {
    config?: {
        [keyName: string]: IListComponentFieldConfig;
    };
    errorMessages: any;
    schema: oas31.SchemaObject;
    data: T[];
    onAddRow: () => void;
    onDeleteRow: (rowIndex: number) => void;
    formTitle?: string;
    disabled?: boolean;
    onInputChange: (value: T, key: string, rowIndex: number) => void;
    width: number;
    height: number;
    columnWidth?: number;
    rowHeight?: number;
}
export default function ListSchemaForm<T>(props: IProps<T>) {
    const {
        rowHeight = 36,
        columnWidth,
        config,
        data,
        schema,
        height,
        width,
        onAddRow,
        onDeleteRow,
        onInputChange,
        disabled,
    } = props;
    const { properties = {} } = schema;
    const columnNames = React.useMemo(() => {
        const columns = [...Object.keys(properties), "Action"];
        if (!config) {
            return columns;
        }
        const hiddenColumns = Object.entries(config).reduce<string[]>(
            (prev, [propName, propConfig]) => {
                if (propConfig.hidden) {
                    prev.push(propName);
                }
                return prev;
            },
            []
        );
        return columns.filter((key) => !hiddenColumns.includes(key));
    }, [config, properties]);

    const heading = React.useCallback(
        ({ index, style }: { index: number; style: React.CSSProperties }) => {
            const propName = columnNames[index];
            const propConfig = config ? config[propName] : undefined;
            // @ts-ignore
            return (
                <div className={"title"} style={style}>
                    {propName === "Action"
                        ? ""
                        : propConfig?.title || camelTextToTitleText(propName)}
                </div>
            );
        },
        [columnNames, config]
    );

    const getComponent = React.useCallback(
        (
            schemaObj: oas31.SchemaObject,
            key: string,
            title: string,
            rowIndex: number,
            value?: "date" | "date-time" | "string" | "boolean",
            errorMessage?: string,
            configProps?: IListComponentFieldConfig
        ) => {
            const { type, format, readOnly, enum: enumItems, maxLength } = schemaObj;

            const onInputChangeHandler = (
                e: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
            ) => {
                const extractedValue =
                    configProps?.extractValue && configProps?.extractValue(key, e);

                onInputChange(
                    {
                        ...data[rowIndex],
                        ...(extractedValue
                            ? extractedValue
                            : {
                                [key]:
                                    type === "integer"
                                        ? parseInt(e.target.value)
                                        : e.target.value,
                            }),
                    },
                    key,
                    rowIndex
                );
            };

            switch (schemaObj.type) {
                case "string":
                    return format === "date" || format === "date-time" ? (
                        <DatePicker
                            dateFormat="dd-MM-yyyy"
                            selected={
                                value ? new Date(value as "date" | "date-time") : new Date()
                            }
                            onChange={() => {}}
                            disabled={readOnly || disabled}
                        />
                    ) : configProps?.component === "select" || enumItems ? (
                        <select
                            className={errorMessage ? "input-error" : ""}
                            value={value}
                            onChange={onInputChangeHandler}
                            disabled={readOnly || disabled}
                        >
                            <option key={"default-option"} value={"default-option"}>
                                Select {camelTextToTitleText(key)}
                            </option>
                            {(configProps?.options || enumItems || []).map(
                                (
                                    item: string | { [optionKey: string]: string | boolean },
                                    optionIndex
                                ) => {
                                    const isObjectType = typeof item === "object";
                                    const itemKey = Object.keys(item);
                                    let name = (isObjectType ? item[itemKey[1]] : item) as string;
                                    const optionDisabled = (
                                        isObjectType ? item[itemKey[2]] : false
                                    ) as boolean;
                                    return (
                                        <option
                                            className={optionDisabled ? "select-option-disabled" : ""}
                                            disabled={optionDisabled}
                                            key={optionIndex}
                                            value={name}
                                        >
                                            {name}
                                        </option>
                                    );
                                }
                            )}
                        </select>
                    ) : maxLength && maxLength > 100 ? (
                        <textarea
                            className={errorMessage ? "input-error" : ""}
                            placeholder={`Enter ${title}`}
                            disabled={readOnly || disabled}
                            value={value || ""}
                            rows={6}
                            onChange={onInputChangeHandler}
                        />
                    ) : (
                        <input
                            className={errorMessage ? "input-error" : ""}
                            placeholder={`Enter ${title}`}
                            disabled={readOnly || disabled}
                            value={value || ""}
                            onChange={onInputChangeHandler}
                        />
                    );
                case "integer":
                    return (
                        <input
                            type={"number"}
                            className={``}
                            placeholder={`Enter ${title}`}
                            disabled={readOnly || disabled}
                            value={value || ""}
                            onChange={onInputChangeHandler}
                        />
                    );
            }
        },
        [data, disabled, onInputChange]
    );

    const cell = React.useCallback(
        ({
             columnIndex,
             rowIndex,
             style,
         }: {
            columnIndex: number;
            rowIndex: number;
            style: React.CSSProperties;
        }) => {
            const propName = columnNames[columnIndex];
            const row = data[rowIndex];
            // @ts-ignore
            const propValue = row?.[propName];
            const schemaObj = (schema.properties?.[propName] ||
                getEmptyObject(schema)) as oas31.SchemaObject;
            const propConfig = config ? config[propName] : undefined;
            return (
                <div className={"cell"} style={style}>
                    {propName !== "Action" ? (
                        getComponent(
                            schemaObj,
                            propName,
                            camelTextToTitleText(propName),
                            rowIndex,
                            propValue,
                            "",
                            propConfig
                        )
                    ) : (
                        <img
                            style={{
                                pointerEvents: disabled ? "none" : "all",
                                opacity: disabled ? 0.5 : 1,
                                float: "right",
                            }}
                            alt={"trash icon"}
                            src={trashIcon}
                            width="30"
                            height="23"
                            onClick={() => onDeleteRow(rowIndex)}
                        />
                    )}
                </div>
            );
        },
        [columnNames, config, data, disabled, getComponent, onDeleteRow, schema]
    );

    const { columnWidths, dynamicWidthColumnCount, fixedWidthColumnsWidth } =
        React.useMemo(() => {
            let fixedWidthColumnsWidth = 0;
            let dynamicWidthColumnCount = 0;
            columnNames.forEach((propName) => {
                const propConfig = config ? config[propName] : undefined;
                if (propConfig?.width) {
                    fixedWidthColumnsWidth += propConfig.width;
                } else {
                    dynamicWidthColumnCount += 1;
                }
            }, 0);
            const dynamicColumnWidth = Math.floor(
                (width - 16 - fixedWidthColumnsWidth) / dynamicWidthColumnCount
            );

            const columnWidths = columnNames.map((propName) => {
                const propConfig = config ? config[propName] : undefined;
                return propName === "Action"
                    ? 95
                    : propConfig?.width || columnWidth || dynamicColumnWidth;
            });
            return { columnWidths, dynamicWidthColumnCount, fixedWidthColumnsWidth };
        }, [columnNames, columnWidth, config, width]);

    const getColumnWidth = React.useCallback(
        (columnIndex: number) => columnWidths[columnIndex],
        [columnWidths]
    );

    const getRowHeight = React.useCallback(() => rowHeight, [rowHeight]);

    const totalWidth = React.useMemo(
        () =>
            columnWidths.reduce((a, b) => {
                return a + b;
            }, 0),
        [columnWidths]
    );
    return (
        <div
            style={{
                width: totalWidth,
            }}
            className={"list-schema-form"}
        >
            <div className={"action-container"}>
                <div className={"flex-1"}>
                    <div className={"page-title my-1 mx-1"}>{"Server Application"}</div>
                </div>
                <div
                    style={{
                        pointerEvents: disabled ? "none" : "all",
                        opacity: disabled ? 0.5 : 1,
                        paddingTop: "1.5rem",
                    }}
                    onClick={onAddRow}
                >
                    <img alt={"plus icon"} src={plusIcon} width="30" height="30" />
                </div>
            </div>
            <hr />
            <VariableSizeList
                width={width}
                height={40}
                itemSize={getColumnWidth}
                itemCount={columnNames.length}
                layout={"horizontal"}
            >
                {heading}
            </VariableSizeList>
            <VariableSizeGrid
                columnCount={columnNames.length}
                columnWidth={getColumnWidth}
                height={height}
                rowCount={data.length}
                rowHeight={getRowHeight}
                width={dynamicWidthColumnCount ? width : fixedWidthColumnsWidth}
            >
                {cell}
            </VariableSizeGrid>
        </div>
    );
}
