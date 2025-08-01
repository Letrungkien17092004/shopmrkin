/**
 * PRISMA ERROR CODE:
 * ==== DATABASE ERROR ===
 * P1003 - Database does not exist
 * 
 * ==== QUERY ERROR ====
 * P2002 - Unique constraint failed
 * P2003 - Foreign key constraint failed
 * P2025 - Record not found
 */

/**
 * PRISMA ERROR OBJECT
 * PrismaClientInitializationError: initial database, connection,...
 * PrismaClientUnknownRequestError: unknown error, unexpected incident, internet,...
 * PrismaClientRustPanicError: serious error, engine crash,...
 */

import {
    PrismaClientKnownRequestError,
    PrismaClientInitializationError,
    PrismaClientRustPanicError
} from "services/postgresSQL/generated/prisma/client/runtime/library";

/**
 * enum for the REPO ERROR CODE
 */
export enum REPO_ERROR_CODE {
    UNKNOW = "REPO_000",
    NOTFOUND = "REPO_001",
    UNIQUE_CONSTRAINT = "REPO_002",
    FOREIGNKEY_CONSTRAINT = "REPO_003",
    VALIDATION = "REPO_004",
    INITIAL = "REPO_005",
    SERIOUS = "REPO_006",
    DATABASE_NOT_EXIST = "REPO_007"
}

/**
 * class Error when handle Repo error
 */
export class REPO_ERROR extends Error {
    code: REPO_ERROR_CODE

    constructor({message, code}: {message?: string, code: REPO_ERROR_CODE}) {
        super(message)
        this.code = code
    }
}


/**
 * Base exception handler for Repository
 * @param {unknown} error an error object
 * 
 * @returns {REPO_ERROR} REPO_ERROR: a object representing an error when executing a request
 * - string REPO_ERROR.message: detailt message for the error
 * - string REPO_ERROR.code: error code
 */
export function baseExceptionHandler(error: unknown) {
    console.log(error)
    if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P1003":
                return new REPO_ERROR({ message: error.message, code: REPO_ERROR_CODE.DATABASE_NOT_EXIST })
            case "P2002":
                return new REPO_ERROR({ message: error.message, code: REPO_ERROR_CODE.UNIQUE_CONSTRAINT })
            case "P2003":
                return new REPO_ERROR({ message: error.message, code: REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT })
            case "P2025":
                return new REPO_ERROR({ message: error.message, code: REPO_ERROR_CODE.NOTFOUND })
        }
    }

    else if (error instanceof PrismaClientInitializationError) {
        return new REPO_ERROR({
            message: error.message,
            code: REPO_ERROR_CODE.INITIAL
        })
    }

    else if (error instanceof PrismaClientRustPanicError) {
        return new REPO_ERROR({
            message: error.message,
            code: REPO_ERROR_CODE.SERIOUS
        })
    }

    return new REPO_ERROR({
        message: (error as unknown as Error).message,
        code: REPO_ERROR_CODE.UNKNOW
    })
}