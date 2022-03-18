import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnersCourses$!: Observable<Course[]>;
  advancedCourses$!: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.beginnersCourses$ = this.coursesService.loadCoursesByCategory('BEGINNER');
    this.advancedCourses$ = this.coursesService.loadCoursesByCategory('ADVANCED');
  }

}
