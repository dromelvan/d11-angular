import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SidenavComponent,
                NoopAnimationsModule
            ]
        });
        fixture = TestBed.createComponent(SidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the sidenav', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle the sidenav', () => {
        const toggleSpy = spyOn(component.sidenav, 'toggle');

        component.toggle();

        expect(toggleSpy).toHaveBeenCalled();
    });

});
