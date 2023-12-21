export interface CategoryType{
    collectionNo : number ,
    categoryNo : number ,
    userdDto : UsersType,
    userNo : number
    content : string ,
    delYn : string

}

export interface UsersType{
    userNo : number ,
    userId : string ,
    passowrd : string ,
    eamil : string ,
    phone : string ,
    regDate :  string
}

export interface LedgerType {
    fileOwnerNo: number,
    userDto: UsersType,
    categoryDto: CategoryType,
    price: number,
    ledgerType: string,
    location: location,
    comment: string,
    regDate : string
    filesDtoList : FilesType[]
}

export interface FilesType {
    fileNo : number,
    filePath : string
}

export interface RequestBoard{
    fileManagerNo : number,
    userDto : UsersType,
    title : string,
    content : string,
    userNo : number
}
export interface location{
    x : number,
    y : number
}

