import { MainService } from './../main.service';
import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as mysql from 'mysql';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {

  list = [];
  host: string;
  username: string;
  password: string;
  port = 3306;
  databaseName: string;
  constructor(
    private mainService: MainService
  ) { }

  async ngOnInit() {
    await this.getConnection();
    await this.getList();
  }

  getConnection() {
    this.host = localStorage.getItem('host') ? localStorage.getItem('host') : '';
    this.username = localStorage.getItem('username') ? localStorage.getItem('username') : '';
    if (localStorage.getItem('password')) {
      const bytes = CryptoJS.AES.decrypt(localStorage.getItem('password'), 'secret key34567');
      const password = bytes.toString(CryptoJS.enc.Utf8);
      this.password = password;
    }
    this.databaseName = localStorage.getItem('databaseName') ? localStorage.getItem('databaseName') : '';
    this.port = +localStorage.getItem('port') ? +localStorage.getItem('port') : 3306;
  }

  async getList() {
    try {
      const rs: any = await this.mainService.getTrade();
      this.list = rs;
      console.log(rs);
    } catch (error) {
      console.log(error);

    }
  }

  onKeyTMT(e, productId) {
    const idx = this.list.findIndex(s => s.product_id == productId);
    if (idx > -1) {
      this.list[idx].tmt_id = e.target.value;
      this.list[idx].isEdit = 'Y';
    }
  }

  onKeyDC24(e, productId) {
    const idx = this.list.findIndex(s => s.product_id == productId);
    if (idx > -1) {
      this.list[idx].tmt_id = e.target.value;
      this.list[idx].isEdit = 'Y';
    }
  }

  async save(productId) {
    try {
      const idx = this.list.findIndex(s => s.product_id == productId);
      if (idx > -1) {
        this.list[idx].isEdit = 'N';
        await this.mainService.updateTMTDC24(productId, this.list[idx].tmt_id, this.list[idx].dc24);
      }
    } catch (error) {

    }
  }
}
