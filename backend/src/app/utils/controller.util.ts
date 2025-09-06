import { StringHelpers } from "./string.util";

export function Controller<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);

            const propertyNames = Object.getOwnPropertyNames(constructor.prototype);

            for (const name of propertyNames) {
                if (name === "constructor") continue;
                const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, name);
                if (!descriptor) continue;

                const isMethod = typeof descriptor.value === "function";
                if (!isMethod) continue;

                const originalMethod = descriptor.value as Function;

                (this as any)[name] = (...methodArgs: any[]) => {
                    const [req, res, next] = methodArgs;

                    if (req?.body && typeof req.body === "object") {
                        req.body = StringHelpers.trimObject(req.body);
                    }

                    return originalMethod.apply(this, methodArgs);
                };
            }
        }
    };
}
