import Ajv, { ErrorObject } from "ajv";
import addFormat from "ajv-formats";
const ajv = new Ajv({ allErrors: true });
addFormat(ajv);

export type TSchemaFormErrors<T = {}> = {
    [P in keyof Partial<T>]: string;
};

export function validationErrorsToSchemaFormErrors(
    errors: Array<ErrorObject>
): TSchemaFormErrors {
    return errors.reduce<TSchemaFormErrors>((prev, error) => {
        // @ts-ignore
        prev[error.instancePath.substring(1)] = error.message as string;
        return prev;
    }, {});
}

export default ajv;
