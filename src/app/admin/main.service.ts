import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import * as CryptoJS from 'crypto-js';
import * as mysql from 'mysql';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);


@Injectable()
export class MainService {

  constructor(@Inject('API_URL') private url: string, private authHttp: AuthHttp) { }

  all(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/users`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  connection() {
    const host = localStorage.getItem('host') ? localStorage.getItem('host') : '';
    const username = localStorage.getItem('username') ? localStorage.getItem('username') : '';
    let password;
    if (localStorage.getItem('password')) {
      const bytes = CryptoJS.AES.decrypt(localStorage.getItem('password'), 'secret key34567');
      password = bytes.toString(CryptoJS.enc.Utf8);
    }
    const databaseName = localStorage.getItem('databaseName') ? localStorage.getItem('databaseName') : '';
    const port = +localStorage.getItem('port') ? +localStorage.getItem('port') : 3306;
    const connection = mysql.createConnection({
      host: host,
      user: username,
      password: password,
      database: databaseName,
      port: port
    });
    return connection;
  }

  async getTrade() {
    return new Promise(async (resolve, reject) => {
      const connection = await this.connection();
      connection.connect();
      connection.query(`SELECT mg.generic_name,mp.*,'N' as isEdit from mm_products as mp join mm_generics as mg on mp.generic_id = mg.generic_id`,
        function (error, results, fields) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
    });
  }

  async getUnits() {
    return new Promise(async (resolve, reject) => {
      const connection = await this.connection();
      connection.connect();
      connection.query(`SELECT mm_units.*,'N' as isEdit from mm_units where is_deleted='N'`,
        function (error, results, fields) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
    });
  }

  async updateTMTDC24(productId, tmtId, dc24) {
    return new Promise(async (resolve, reject) => {
      const connection = await this.connection();
      connection.connect();
      connection.query(`update mm_products set tmt_id=${tmtId},dc24=${dc24} where product_id=${productId}`,
        function (error, results, fields) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
    });
  }

  async removeLocalUnits() {
    const rs = await db.get('mm_units')
      .remove()
      .write();
    return rs;
  }

  async insertLocalUnits(data) {
    const rs = await db.get('mm_units')
      .push(data)
      .write();
    return rs;
  }

  async getLocalUnits() {
    const rs = await db.get('mm_units')
      .value();
    return rs;
  }

  async updateLocalUnitCode(id, code) {
    const rs = await db.get('mm_units')
      .find({ unit_id: id })
      .assign({ unit_code: code })
      .write();
    return rs;
  }
}
