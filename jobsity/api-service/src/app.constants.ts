
export interface AppConstants {
    jwtSecret?: string,
    jwtExpiresIn?: string,
    dbPath?: string,
    emailHost?: string,
    emailPort?: number,
    emailUser?: string,
    emailPass?: string
}

export const APP_CONSTANTS: AppConstants = {
    jwtSecret: 'my-secret-jwt',
    jwtExpiresIn: '60m',
    dbPath: './assets'
}

export const TEST_APP_CONSTANTS: AppConstants = {
    jwtSecret: 'my-secret-jwt',
    jwtExpiresIn: '60m'
}