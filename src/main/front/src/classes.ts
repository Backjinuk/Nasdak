import {CategoryType, FilesType, LedgerType, SnsType, UserType} from 'TypeList';

export class User implements UserType {
  userNo = 0;
  userId = '';
  password = '';
  email = '';
  phone = '';
  profile = '';
  regDate = '';
  sendKakaoTalk = false;
  sendWebPush = false;
  pushTime = '';
  snsDtoList = [];

  static getByString(json: string) {
    const data = JSON.parse(json);
    return this.getByData(data);
  }

  static getByData(data: any) {
    const object = new User();
    Object.assign(object, data);
    return object;
  }
}

export class Category implements CategoryType {
  categoryNo = 0;
  content = '';
  delYn = '';
  userNo = 0;

  static getByString(json: string) {
    const data = JSON.parse(json);
    return this.getByData(data);
  }

  static getByData(data: any) {
    const object = new this();
    Object.assign(object, data);
    return object;
  }
}

export class Sns implements SnsType {
  accessToken = '';
  snsId = '';
  snsNo = 0;
  snsType = '';
  userNo = 0;

  static getByString(json: string) {
    const data = JSON.parse(json);
    return this.getByData(data);
  }

  static getByData(data: any) {
    const object = new this();
    Object.assign(object, data);
    return object;
  }
}

export class Ledger implements LedgerType {
  fileOwnerNo = 0;
  userDto = {...new User()};
  categoryDto = {...new Category()};
  x = 0;
  y = 0;
  price = 0;
  price2 = 0;
  ledgerType = '';
  ledgerType2 = '';
  location = {...new location()};
  useDate = '';
  comment = '';
  regDate = '';
  filesDtoList = [] as FilesType[];

  static getByString(json: string) {
    const data = JSON.parse(json);
    return this.getByData(data);
  }

  static getByData(data: any) {
    const object = new this();
    Object.assign(object, data);
    return object;
  }

}

export class location implements location {
  x = 0;
  y = 0;
  address = '';

  static getByString(json: string) {
    const data = JSON.parse(json);
    return this.getByData(data);
  }

  static getByData(data: any) {
    const object = new this();
    Object.assign(object, data);
    return object;
  }
}
