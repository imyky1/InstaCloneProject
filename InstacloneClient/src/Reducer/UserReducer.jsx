
export const intialState = null
export const  UserReducer = (state,action)=>{
    if (action.type == 'USER'){
        return action.payload
    }
    if (action.type == 'CLEAR'){
        return null
    }
    if(action.type=='UPDATE'){
        return{
            ...state,
            followers:action.payload.followers,
            following:action.payload.following,
        }
    }
    return state
}