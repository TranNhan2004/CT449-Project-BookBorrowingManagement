export function Controller<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);

            const propertyNames = Object.getOwnPropertyNames(constructor.prototype);
            for (const name of propertyNames) {
                if (name === 'constructor') continue;
                const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, name);
                if (!descriptor) continue;

                const isMethod = typeof descriptor.value === 'function';
                if (!isMethod) continue;

                (this as any)[name] = (descriptor.value as Function).bind(this);
            }
        }
    };
}
