import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { SchoolNameEnum } from '../../enums/school-name.enum';
import { SchoolModel } from '../../models/school.model';
import { FastAPIService } from '../fastAPI/fast-api.service';

@Injectable({ providedIn: 'root' })
export class SchoolService implements OnDestroy {
  schools: Observable<Array<SchoolModel>>;

  private _schools = new BehaviorSubject<Array<SchoolModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(private fastAPIService: FastAPIService) {
    this.schools = this._schools.asObservable();
    // this.loadSchools();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  loadSchools(): void {
    this.fastAPIService
      .getAllSchools()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (s) => {
          this._schools.next(s);
        },
      });
  }

  getSchoolByName(school: string): Observable<SchoolModel | null> {
    return this.fastAPIService.getSchoolByName(school);
  }

  getSchool(schoolName: SchoolNameEnum): SchoolModel {
    let returnSchool: SchoolModel = new SchoolModel();
    this._schools.value.forEach((school) => {
      if (school.School == schoolName) {
        returnSchool = school;
      }
    });

    return returnSchool;
  }
}
