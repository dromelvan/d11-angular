import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {

  private xSmall!: boolean;
  private small!:boolean;
  private medium!: boolean;
  private large!: boolean;
  private xLarge!: boolean;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.observeScreenSize();
  }

  private observeScreenSize() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe((result) => {
      this.xSmall = result.breakpoints[Breakpoints.XSmall];
      this.small = result.breakpoints[Breakpoints.Small];
      this.medium = result.breakpoints[Breakpoints.Medium];
      this.large = result.breakpoints[Breakpoints.Large];
      this.xLarge = result.breakpoints[Breakpoints.XLarge];
    });
  }

  isXs(): boolean {
    return this.xSmall;
  }

  isSm(): boolean {
    return this.small;
  }

  isSmAndDown(): boolean {
    return this.small || this.xSmall;
  }

  isSmAndUp(): boolean {
    return !this.xSmall;
  }

  isMd(): boolean {
    return this.medium;
  }

  isMdAndDown(): boolean {
    return this.medium || this.small || this.xSmall;
  }

  isMdAndUp(): boolean {
    return this.medium || this.large || this.xLarge;
  }

  isLg(): boolean {
    return this.large;
  }

  isLgAndDown(): boolean {
    return !this.xLarge;
  }

  isLgAndUp(): boolean {
    return this.large || this.xLarge;
  }

  isXl(): boolean {
    return this.xLarge;
  }

}
