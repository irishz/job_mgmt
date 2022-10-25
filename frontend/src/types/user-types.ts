export interface user {
    setuserToken: Function
}

export interface iUserAPI {
        _id: string,
        updatedAt: Date,
        createdAt: Date,
        name: string,
        role: string,
        department: string,
        password: string,
        employee_code: number,
}