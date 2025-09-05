export class StringHelpers {
    static trimObject<T extends Record<string, any>>(obj: T): T {
        const trimmedObj: any = Array.isArray(obj) ? [] : {};

        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

            const value = obj[key];

            if (typeof value === 'string') {
                trimmedObj[key] = value.trim();
            } else if (Array.isArray(value)) {
                trimmedObj[key] = value.map((v: string | null) =>
                    typeof v === 'string' ? v.trim() : (typeof v === 'object' && v !== null ? this.trimObject(v) : v)
                );
            } else if (typeof value === 'object' && value !== null) {
                trimmedObj[key] = this.trimObject(value);
            } else {
                trimmedObj[key] = value;
            }
        }

        return trimmedObj;
    }
}
