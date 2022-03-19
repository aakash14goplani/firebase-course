import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { CoursesService } from './courses.service';

@Injectable({ providedIn: 'root' })
export class CoursesResolver implements Resolve<Course | null> {

  constructor(
    private coursesService: CoursesService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course | null> {
    const courseURL = route.paramMap.get('courseUrl') as string;
    return this.coursesService.findCourseByURL(courseURL);
  }
}
