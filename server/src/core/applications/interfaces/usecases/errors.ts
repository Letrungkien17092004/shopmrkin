/**
 * Enum representing standardized error codes for use case execution errors.
 *
 * This enum defines specific error codes to categorize and identify
 * different types of errors that may occur during the execution of use case functions.
 *
 * @enum USECASE_ERROR_CODE
 * @property {string} ENGINE   - Engine error, such as issues with the Prisma client or initial database setup.
 * @property {string} UNKNOW   - Unknown error, including connection or internet-related issues.
 * @property {string} NOTFOUND - Resource not found error.
 * @property {string} EXIST    - Resource already exists error.
 */
export enum USECASE_ERROR_CODE {
    ENGINE = "UC_000", // engine error, prisma client, initial database
    UNDEFINED = "UC_001", // this error only occurs when it does not belong to the remaining errors
    UNKNOW = "UC_002", // unknow error(connection, internet, ...)
    NOTFOUND = "UC_003", // resource not found
    EXISTED = "UC_004", // resource already exist
}



/**
 * Represents an error that occurs during the execution of use cases.
 * 
 * This class is used to store error information, including a custom error code,
 * that arises when executing application use cases.
 *
 * @example
 * ```typescript
 * throw new USECASE_ERROR({ message: "User not found", code: "USER_NOT_FOUND" });
 * code: 
 * - UC_000: engine error, prisma client, initial database
 * - UC_001: unknow error (connection, internet,...)
 * - UC_002: resource not found
 * - UC_003: resource already exist
 * ```
 * 
 *
 * @property code - A string representing the specific error code for the use case error.
 */
export class USECASE_ERROR extends Error {
    code: USECASE_ERROR_CODE
    constructor({ message, code }: { message?: string, code: USECASE_ERROR_CODE }) {
        super(message)
        this.code = code
    }
}