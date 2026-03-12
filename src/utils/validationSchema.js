export const createUserValidationSchema = {
    name: {
        isLength: {
            options: {
                min: 2,
                max: 32
            },
            errorMessage: 'Name must be at least 2 characters with a max of 32 characters'
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty',
        },
        isString: {
            errorMessage: 'Name must be a string'
        },
    },
    email: {
        notEmpty: {
            errorMessage: 'Email cannot be empty',
        },
    },
    password: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Password must be at least 5 characters with a max of 32 characters'
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty',
        },
    },

}