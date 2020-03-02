import { MainService } from './../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {

  list = [];
  constructor(
    private mainService: MainService
  ) { }

  ngOnInit() {
    this.getList();
  }

  async getList() {
    const rs: any = await this.mainService.getUnits();
    const local: any = await this.mainService.getLocalUnits();


    for (const r of rs) {
      r.isEdit = 'N';
      const idx = local.findIndex(s => s.unit_id == r.unit_id);
      if (idx == -1) {
        await this.mainService.insertLocalUnits(r);
        local.push(r);
      }
    }
    // for (const l of local) {
    //   l.isEdit = 'N';
    // }
    this.list = local;
  }

  onKey(e, unitId) {
    const idx = this.list.findIndex(s => s.unit_id == unitId);
    if (idx > -1) {
      this.list[idx].unit_code = e.target.value;
      this.list[idx].isEdit = 'Y';
    }
  }

  async onSave(unitId) {
    try {
      const idx = this.list.findIndex(s => s.unit_id == unitId);
      if (idx > -1) {
        this.list[idx].isEdit = 'N';
        await this.mainService.updateLocalUnitCode(unitId, this.list[idx].unit_code);
      }
    } catch (error) {

    }
  }
}
