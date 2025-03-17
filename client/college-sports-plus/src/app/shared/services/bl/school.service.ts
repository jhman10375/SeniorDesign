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

    // const schools: Array<SchoolModel> = [];
    // const UniversityOfCincinnati: SchoolModel = new SchoolModel();
    // UniversityOfCincinnati.ID = '0';
    // UniversityOfCincinnati.Name = SchoolNameEnum.UniversityOfCincinnati;
    // UniversityOfCincinnati.PrimaryColor = 'red';
    // UniversityOfCincinnati.SecondaryColor = 'black';
    // schools.push(UniversityOfCincinnati);

    // const OhioStateUniversity: SchoolModel = new SchoolModel();
    // OhioStateUniversity.ID = '1';
    // OhioStateUniversity.Name = SchoolNameEnum.OhioStateUniversity;
    // OhioStateUniversity.PrimaryColor = '#ba0c2f';
    // OhioStateUniversity.SecondaryColor = 'grey';
    // schools.push(OhioStateUniversity);

    // const UniversityOfOregon: SchoolModel = new SchoolModel();
    // UniversityOfOregon.ID = '2';
    // UniversityOfOregon.Name = SchoolNameEnum.UniversityOfOregon;
    // UniversityOfOregon.PrimaryColor = '#154733';
    // UniversityOfOregon.SecondaryColor = '#FEE123';
    // schools.push(UniversityOfOregon);

    // this.schools = schools;
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
