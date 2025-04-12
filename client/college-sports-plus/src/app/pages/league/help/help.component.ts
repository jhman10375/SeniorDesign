import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  imports: [],
  selector: 'help',
  templateUrl: 'help.component.html',
  styleUrls: ['help.component.scss'],
})
export class HelpComponent implements OnInit {
  constructor(
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes('#')) {
          this.scrollToId(event.url.split('#')[1]);
        }
      });
  }

  scrollToElement(event: MouseEvent): void {
    event.preventDefault();
    const targetId = (event.target as HTMLAnchorElement)
      .getAttribute('href')
      ?.substring(1);
    if (targetId) {
      this.scrollToId(targetId);
    }
  }

  private scrollToId(id: string): void {
    const element = this.el.nativeElement.querySelector(`#${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
