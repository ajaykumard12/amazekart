
export const initialState={
    name:{
        value:null,
        isValid:null,
    },
    username:{
        value:null,
        isValid:null,
    },
    email:{
        value:null,
        isValid:null,
    },
    password:{
        value:null,
        validation:{
            hasLowercase:null,
            hasUppercase:null,
            hasSpecialCharacter:null,
            hasNumber:null,
            meetMinnumReq:null,
        }
    }
}

export const ACTION_TYPES= {

    NAME:"name",
    USERNAME:"username",
    EMAIL:"email",
    PASSWORD:"password",

};

const NAME_PATTERN= /^[A-Z][a-z]+$/;
const USERNAME_PATTERN= /^[a-z]+$/;
const EMAIL_PATTERN= /^\w+([.+]\w+)?(_\w+)?@[a-z]{3,}\.[a-z]{2,}$/;





// action -> {type, payload}
const signupReducer = (state = initialState, action) => {

    const {type, payload} = action ||{};

    switch(type){
        case ACTION_TYPES.NAME:
            const copystate= {...state};
            copystate.name= {value:payload, isValid:NAME_PATTERN.test(payload)};
            return copystate;

        case ACTION_TYPES.USERNAME:
            return {
                ...state,
                username: {value:payload, isValid: USERNAME_PATTERN.test(payload)},
            };
        case ACTION_TYPES.EMAIL:
            return{
                ...state,
                email: {value:payload, isValid: EMAIL_PATTERN.test(payload)},

            };       
        case ACTION_TYPES.PASSWORD:
            return{
                ...state,
                password: {
                    value: payload,
                    validation:{
                        hasLowercase:/[a-z]/.test(payload),
                        hasUppercase:/[A-Z]/.test(payload),
                        hasNumber:/[0-9]/.test(payload),
                        hasSpecialCharacter:/[\W_]/.test(payload),
                        meetMinnumReq: payload.length >=8,
                    }
                }
            };
        
        default:
            return state;



    }
    

};

export default signupReducer;