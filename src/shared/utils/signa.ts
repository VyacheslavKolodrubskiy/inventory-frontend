// https://kaztoken.kz/mobile-docs/

import { i18n } from '@/i18n';

interface SubjectDN {
  SERIALNUMBER?: string
  EMAILADDRESS?: string
  OU?: string
  E?: string
  CN?: string
  O?: string
}

interface MessageBody {
  args: any[]
  method: typeof Method[keyof typeof Method]
  module: typeof NcaModule[keyof typeof NcaModule]
}

// Модуль
const NcaModule = {
  // https://github.com/pkigovkz/NLCommonBundle/blob/master/src/main/java/kz/gov/pki/knca/CommonUtils.java
  CommonUtils: 'kz.gov.pki.knca.commonUtils',
  // Accessory = 'kz.gov.pki.ncalayerservices.accessory',
} as const;

// Тип хранилища
const StorageName = {
  PKCS12: 'PKCS12',
} as const;

// Тип использования ключа
const KeyType = {
  Signature: 'SIGNATURE',
} as const;

// Метод модуля
const Method = {
  SignXML: 'signXml',
  SignXMLs: 'signXmls',
  GetKeyInfo: 'getKeyInfo',
  CreateCAdESFromBase64: 'createCAdESFromBase64',
  CreateCAdESFromBase64Hash: 'createCAdESFromBase64Hash',
  ApplyCAdEST: 'applyCAdEST',
} as const;

export class Signa {
  webSocket: WebSocket | null;

  constructor() {
    // TODO Добавить колбэки для onOpen, onClose, onError? onCancel??
    this.webSocket = null;
  }

  private connect() {
    return new Promise((resolve) => {
      if (this.webSocket) {
        resolve(true);
        return;
      }

      this.webSocket = new WebSocket('wss://127.0.0.1:13579/');
      console.log('WebSocket инициализирован');

      this.webSocket.onopen = () => {
        // TODO
        console.log('onopen');
      };

      this.webSocket.onmessage = (event) => {
        console.log('onmessage', event);
        if (!(event && event.data))
          return;

        resolve(event.data);
      };

      this.webSocket.onclose = (event) => {
        this.unblockUI();
        if (!event.wasClean)
          this.showErrDialog(i18n.t('common.ncaLayerConnectionError'));

        console.log(`Code: ${event.code} Reason: ${event.reason}`);
      };
    });
  }

  // todo типы для промиса
  sendMessage(body: MessageBody): Promise<any> {
    return this.connect()
      .then(() => {
        return new Promise((resolve) => {
          this.blockUI();
          this.webSocket!.send(JSON.stringify(body));
          this.webSocket!.onmessage = (event) => {
            this.unblockUI();
            if (!(event && event.data))
              return;

            const res = JSON.parse(event.data);

            console.log('onmessage after connect', res);
            if (res.code === '200')
              resolve(res.responseObject);
            // todo потестить 500 ошибку "canceled"
            // else
            //   reject(res)

            this.close();
          };
        });
      });
  }

  private blockUI() {
    // TODO Оверлей
  }

  private unblockUI() {
    // TODO Оверлей
  }

  private close() {
    if (!this.webSocket)
      return;

    this.webSocket.close(1000, 'Work complete!');
    this.webSocket = null;
  }

  private showErrDialog(title: string) {
    // eslint-disable-next-line no-alert
    alert(title);
    this.close();
  }

  getAuthInfo() {
    return this.sendMessage({
      module: NcaModule.CommonUtils,
      method: Method.GetKeyInfo,
      args: [StorageName.PKCS12],
    });
  }

  signXml(data: string) {
    return this.sendMessage({
      method: Method.SignXML,
      module: NcaModule.CommonUtils,
      args: [StorageName.PKCS12, KeyType.Signature, data, '', ''],
    });
  }

  signXmls(data: string[]) {
    return this.sendMessage({
      method: Method.SignXMLs,
      module: NcaModule.CommonUtils,
      args: [StorageName.PKCS12, KeyType.Signature, data, '', ''],
    });
  }

  createCAdESFromBase64(base64ToSign: string, flag = false) {
    return this.sendMessage({
      method: Method.CreateCAdESFromBase64,
      module: NcaModule.CommonUtils,
      args: [StorageName.PKCS12, KeyType.Signature, base64ToSign, flag],
    });
  }

  CreateCAdESFromBase64Hash(base64ToSign: string) {
    return this.sendMessage({
      method: Method.CreateCAdESFromBase64Hash,
      module: NcaModule.CommonUtils,
      args: [StorageName.PKCS12, KeyType.Signature, base64ToSign],
    });
  }

  applyCAdEST(cmsForTS: string) {
    return this.sendMessage({
      method: Method.ApplyCAdEST,
      module: NcaModule.CommonUtils,
      args: [StorageName.PKCS12, KeyType.Signature, cmsForTS],
    });
  }

  static getSubjectDN(str: string | unknown) {
    if (typeof str !== 'string')
      return;

    const obj = {} as SubjectDN;

    console.log(str);
    const tmpString = str.split(',');

    console.log(tmpString);

    if (!str.length)
      return;

    tmpString.forEach((pair) => {
      const tmp = pair.split('=');
      // @ts-expect-error todo
      obj[tmp[0].trim()] = tmp[1].trim();
    });

    return {
      iin: obj.SERIALNUMBER ? obj.SERIALNUMBER.replace('IIN', '') : null,
      bin: obj.OU ? obj.OU.replace('BIN', '') : null,
      email: obj.E ? obj.E.toLowerCase() : obj.EMAILADDRESS ? obj.EMAILADDRESS : null,
      name: obj.CN
        ? obj.CN.replace(
          /[\wа-яЁА-ЯЁ]\S*/g,
          t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(),
        )
        : null,
      title: obj.O ? obj.O.replace(/"/g, '').replace(/\\/g, '\'') : null,
    };
  }
}
