export interface CategoryType{
    categoryNo : number ,
    userNo : number
    content : string ,
    delYn : string
}

export interface UsersType{
    userNo : number ,
    userId : string ,
    password : string ,
    email : string ,
    phone : string ,
    profile : string,
    regDate :  string,
    sendKakaoTalk : boolean,
    sendWebPush : boolean
}

export interface LedgerType {
    fileOwnerNo: number,
    userDto: UsersType,
    categoryDto: CategoryType,
    x : number,
    y : number,
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
    y : number,
    address : string
}

