import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { LoginService } from '../login.service';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';
import * as CryptoJS from 'crypto-js';
import * as mysql from 'mysql';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();
  isLogging = false;
  isError = false;
  host: string;
  username: string;
  password: string;
  port = 3306;
  databaseName: string;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.getConnection();
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

  saveConnection() {
    localStorage.setItem('host', this.host);
    localStorage.setItem('username', this.username);
    const password = CryptoJS.AES.encrypt(this.password, 'secret key34567').toString();
    localStorage.setItem('password', password);
    localStorage.setItem('databaseName', this.databaseName);
    localStorage.setItem('port', this.port.toString());

    // const bytes = CryptoJS.AES.decrypt(password, 'secret key34567');
    // const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // console.log(originalText);
  }


  test() {
    const connection = mysql.createConnection({
      host: this.host,
      user: this.username,
      password: this.password,
      database: this.databaseName,
      port: this.port
    });

    connection.connect();

    const that = this;
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) {
        that.alert.error(error.toString());
      } else {
        that.alert.success('Success! Your connection is ready.');
      }
    });
  }

  enterLogin(event) {
    // enter login
    if (event.keyCode === 13) {
      this.save();
    }
  }

  save() {
    this.saveConnection();
    const connection = mysql.createConnection({
      host: this.host,
      user: this.username,
      password: this.password,
      database: this.databaseName,
      port: this.port
    });

    connection.connect();

    const that = this;
    let _error = false;
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) {
        _error = true;
        that.alert.error(error.toString());
      } else {
        _error = false;
      }
    });
    console.log(_error);
    if (!_error) {
      // this.router.navigate(['admin']);
      this.router.navigateByUrl('/admin');
    }
  }
}
