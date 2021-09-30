import { Component, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, AccountService, Account } from 'app/core';
import { HomeService } from './home.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ILeiDianInfo } from 'app/shared/model/lei-dian-info.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  leiDianInfoList: ILeiDianInfo[] = [];
  showList: ILeiDianInfo[];
  isSelectAll = false;
  nowSelectCount = 0;
  setInterval_updateLeiDianInfoList: NodeJS.Timeout;
  filterItem: any = {
    showCheck: 0,   // 0=all, 1=checked, -1=unchecked
    showStatus: 0,  // 0=all, 1=launched, -1=stoped
    keywords: '',
    patchFrom: undefined,
    patchTo: undefined
  };
  sortWindowsSize = 5;
  private searchTerms = new Subject<any>();

  constructor(
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.initLoadLeiDianInfoList();
    this.setRxjsFilter();
  }

  ngOnDestroy() {
  }

  setRxjsFilter() {
    this.searchTerms.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(
      (res: any) => {
        this.filterItem.keywords = res;
        this.updateShowListWithFilter();
      },
      (res: HttpErrorResponse) => { });
  }

  loadFilterString(filterStr: string) {
    this.searchTerms.next(filterStr);
  }

  initLoadLeiDianInfoList() {
    this.homeService.getLeiDianInfoList().subscribe(
      (res: HttpResponse<ILeiDianInfo[]>) => {
        this.leiDianInfoList = res.body;
        this.leiDianInfoList.forEach((l: ILeiDianInfo) => {
          l.checked = false;
        });
        this.showList = this.leiDianInfoList;
        this.updateLeiDianInfoList();
      }, (res: HttpErrorResponse) => {
        this.leiDianInfoList = [];
      }
    );
  }

  updateShowListWithFilter() {
    this.showList = this.leiDianInfoList.filter((l: ILeiDianInfo) => {
      if (this.filterItem.showCheck === 1) {
        return l.checked;
      } else if (this.filterItem.showCheck === -1) {
        return !l.checked;
      } else {
        return true;
      }
    }).filter((l: ILeiDianInfo) => {
      if (this.filterItem.showStatus === 1) {
        return l.running;
      } else if (this.filterItem.showStatus === -1) {
        return !l.running;
      } else {
        return true;
      }
    }).filter((l: ILeiDianInfo) => {
      return l.name.includes(this.filterItem.keywords);
    });
    this.updateSelectAllStatus();
  }

  quitVmByName(leiDianInfo: ILeiDianInfo) {
    this.homeService.quitVmByName(leiDianInfo.name).subscribe(
      (res: HttpResponse<ILeiDianInfo>) => {
      }, (res: HttpErrorResponse) => {
      }
    );
    leiDianInfo.checked = !leiDianInfo.checked;
  }

  launchVmByName(leiDianInfo: ILeiDianInfo) {
    this.homeService.launchVmByName(leiDianInfo.name).subscribe(
      (res: HttpResponse<ILeiDianInfo>) => {
      }, (res: HttpErrorResponse) => {
      }
    );
    leiDianInfo.checked = !leiDianInfo.checked;
  }

  selectAll(value: boolean) {
    this.showList.forEach((l: ILeiDianInfo) => {
      l.checked = value;
    });
    this.updateSelectedCount();
  }

  selectLeiDianInfo(ld: ILeiDianInfo) {
    ld.checked = !ld.checked;
    this.updateSelectAllStatus();
    this.updateSelectedCount();
  }

  updateSelectAllStatus() {
    this.isSelectAll = this.showList.length === 0 || this.showList.find((l: ILeiDianInfo) => {
      return !l.checked;
    }) ? false : true;
  }

  updateSelectedCount() {
    this.nowSelectCount = this.leiDianInfoList.filter((l: ILeiDianInfo) => {
      return l.checked;
    }).length;
  }

  updateLeiDianInfoList() {
    clearInterval(this.setInterval_updateLeiDianInfoList);
    this.homeService.getLeiDianInfoList().subscribe(
      (res: HttpResponse<ILeiDianInfo[]>) => {
        const oldLDListToSetByChecked = new Set(
          this.leiDianInfoList.filter((l: ILeiDianInfo) => {
            return l.checked;
          }).map((l: ILeiDianInfo) => {
            return l.id;
          }));
        this.leiDianInfoList = res.body.map((l: ILeiDianInfo) => {
          if (oldLDListToSetByChecked.has(l.id)) {
            l.checked = true;
          } else {
            l.checked = false;
          }
          return l;
        });
        this.updateShowListWithFilter();
        this.setInterval_updateLeiDianInfoList = setInterval(() => {
          this.updateLeiDianInfoList();
        }, 3000);
      }, (res: HttpErrorResponse) => {
        console.log('update error.');
        this.setInterval_updateLeiDianInfoList = setInterval(() => {
          this.updateLeiDianInfoList();
        }, 3000);
      }
    );
  }

  patchSelect(isCheck: boolean) {
    this.showList.forEach((l: ILeiDianInfo) => {
      if (l.id <= this.filterItem.patchTo && l.id >= this.filterItem.patchFrom) {
        l.checked = isCheck;
      }
    });
    this.updateSelectAllStatus();
    this.updateSelectedCount();
  }

  patchLaunchVmByName() {
    this.homeService.patchLaunchVmByName(
      this.leiDianInfoList.filter((l: ILeiDianInfo) => {
        return l.checked;
      }).map((l: ILeiDianInfo) => {
        return l.name;
      }))
      .subscribe(
        (res: HttpResponse<ILeiDianInfo>) => {
        }, (res: HttpErrorResponse) => {
        });
  }

  patchQuitVmByName() {
    this.homeService.patchQuitVmByName(
      this.leiDianInfoList.filter((l: ILeiDianInfo) => {
        return l.checked;
      }).map((l: ILeiDianInfo) => {
        return l.name;
      }))
      .subscribe(
        (res: HttpResponse<ILeiDianInfo>) => {
        }, (res: HttpErrorResponse) => {
        });
  }

  sortWindows() {
    if (this.sortWindowsSize < 1) {
      this.sortWindowsSize = 1;
    } else if (this.sortWindowsSize > 50) {
      this.sortWindowsSize = 50;
    }
    this.homeService.sortWindows(this.sortWindowsSize)
      .subscribe(
        (res: HttpResponse<ILeiDianInfo>) => {
        }, (res: HttpErrorResponse) => {
        });
  }
}
