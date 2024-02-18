import {Category, User} from "./classes";

export interface CategoryType {
    categoryNo: number;
    userNo: number;
    content: string;
    delYn: string;
}

export interface UserType {
    userNo: number;
    userId: string;
    password: string;
    email: string;
    phone: string;
    profile: string;
    regDate: string;
    sendKakaoTalk: boolean;
    sendWebPush: boolean;
    pushTime: string;
    snsDtoList: SnsType[];
}

export interface SnsType {
    snsNo: number;
    snsId: string;
    userNo: number;
    snsType: string;
    accessToken: string;
}

export interface LedgerType {
    fileOwnerNo: number;
    userDto: UserType;
    categoryDto: CategoryType;
    x: number;
    y: number;
    price: number;
    price2: number;
    ledgerType: string;
    ledgerType2: string;
    location: location;
    comment: string;
    regDate: string;
    useDate : string;
    filesDtoList: FilesType[];
}

export interface FilesType {
    fileNo: number;
    filePath: string;
}

export interface RequestBoard {
    fileManagerNo: number;
    userDto: UserType;
    title: string;
    content: string;
    userNo: number;
}

export interface location {
    x: number;
    y: number;
    address: string;
}


