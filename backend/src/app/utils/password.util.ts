import bcrypt from 'bcrypt';

export class PasswordHelpers {
    /**
     * 
     * @param password 
     * @param minLength 
     * @param maxLength 
     * @param pattern 
     * @returns -1 if password is undefined or empty, -2 if password's length is less than minLength, 
     * -3 if greater than maxLength, -4 if doesn't match pattern 
     * and 1 if pass all check.
     */
    static async checkStrongPassword(password: string | undefined, minLength: number, maxLength: number, pattern: RegExp) {
        if (!password || !password.trim()) {
            return -1;
        }

        if (password.length < minLength) {
            return -2;
        }

        if (password.length > maxLength) {
            return -3;
        }

        if (!pattern.test(password)) {
            return -4;
        }

        return 1;
    }


    static async hash(password: string) {
        return await bcrypt.hash(password, 10);
    }

    static async compare(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }
};




