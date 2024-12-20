require('dotenv').config({ path: './app/config/.env' });

module.exports = {
    app: {
        port: process.env.PORT,
    }, 
    db: {
        uri: process.env.MONGODB_URI,
        collections: {
            user: {
                phoneMinLength: 10,
                phonePattern: /^[0-9]+$/,
                emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                passwordMinLength: 8,
                passwordMaxLength: 20,
                passwordPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
                genderEnum: ['male', 'female', 'other'],
                roleEnum: ['reader','staff'],
                getMinBirth: () => {
                    const today = new Date();
                    today.setFullYear(today.getFullYear() - 100); 
                    return today;
                },
                getMaxBirth: () => {
                    const today = new Date();
                    today.setFullYear(today.getFullYear() - 5); 
                    return today;
                }
            },
            reader: {
                minPoints: 0,
                defaultPoints: 10,
                rankEnum: [
                    { title: 'basic', minPoints: 1, maxPoints: 20, maxExtensionDays: 5, maxReservationDays: 5 },
                    { title: 'bronze', minPoints: 21, maxPoints: 100, maxExtensionDays: 6, maxReservationDays: 5 },
                    { title: 'silver', minPoints: 101, maxPoints: 250, maxExtensionDays: 7, maxReservationDays: 6 },
                    { title: 'gold', minPoints: 251, maxPoints: 600, maxExtensionDays: 8, maxReservationDays: 6 },
                    { title: 'platinum', minPoints: 601, maxPoints: 1500, maxExtensionDays: 9, maxReservationDays: 7 },
                    { title: 'diamond', minPoints: 1501, maxPoints: 9999, maxExtensionDays: 10, maxReservationDays: 7 }
                ],
                disableThreshold: 0,
            },
            staff: {
                positionEnum: ['admin', 'librarian']
            },
            topic: {
                publicIdPattern: /^\d{3}$/
            },
            book: {
                publicIdSuffixLength: 3,
                topicsMaxLength: 5,
                getMinPublishedYear: () => new Date().getFullYear() - 200,
                getMaxPublishedYear: () => new Date().getFullYear(),
                minPrice: 0
            },
            bookItem: {
                publicIdSuffixLength: 2,
                statusEnum: ['available', 'reserved', 'borrowed', 'read-only'],
            },
            review: {
                commentMaxLength: 300,
                ratingEnum: [1, 2, 3, 4, 5],
            },
            bookBorrowing: {
                maxBorrowBookItems: 5,
                standardBorrowDays: 14,
                reward: 5,
                penalty: 5,
            },
            reservation: {
                maxReserveBookItems: 10,
                reward: 5,
                penalty: 5,
            }
        }
    },
    jwtEnv: {
        secretKey: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    cookieEnv: {
        name: process.env.COOKIE_NAME,
        maxAge: parseInt(process.env.COOKIE_MAX_AGE) * 60 * 60 * 1000,
    },
    nodeEnv: process.env.NODE_ENV
};
