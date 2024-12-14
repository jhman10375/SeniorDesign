import { Injectable } from '@angular/core';

import { SchoolNameEnum } from '../../enums/school-name.enum';
import { SchoolModel } from '../../models/school.model';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  schools: Array<SchoolModel> = [];

  constructor() {
    this.loadSchools();
  }

  loadSchools(): void {
    const schools: Array<SchoolModel> = [];
    const UniversityOfCincinnati: SchoolModel = new SchoolModel();
    UniversityOfCincinnati.ID = '0';
    UniversityOfCincinnati.Name = SchoolNameEnum.UniversityOfCincinnati;
    UniversityOfCincinnati.PrimaryColor = 'red';
    UniversityOfCincinnati.SecondaryColor = 'black';
    schools.push(UniversityOfCincinnati);

    const OhioStateUniversity: SchoolModel = new SchoolModel();
    OhioStateUniversity.ID = '1';
    OhioStateUniversity.Name = SchoolNameEnum.OhioStateUniversity;
    OhioStateUniversity.PrimaryColor = '#ba0c2f';
    OhioStateUniversity.SecondaryColor = 'grey';
    schools.push(OhioStateUniversity);

    const UniversityOfOregon: SchoolModel = new SchoolModel();
    UniversityOfOregon.ID = '2';
    UniversityOfOregon.Name = SchoolNameEnum.UniversityOfOregon;
    UniversityOfOregon.PrimaryColor = '#154733';
    UniversityOfOregon.SecondaryColor = '#FEE123';
    schools.push(UniversityOfOregon);

    this.schools = schools;
  }

  getSchool(schoolName: SchoolNameEnum): SchoolModel {
    let returnSchool: SchoolModel = new SchoolModel();
    this.schools.forEach((school) => {
      if (school.Name == schoolName) {
        returnSchool = school;
      }
    });

    return returnSchool;
  }
}
