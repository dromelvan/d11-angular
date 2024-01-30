import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
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

    it('should trigger onOpen', () => {
        const onOpenSpy = spyOn(component, 'onOpen');

        const element = fixture.debugElement.query(By.css('.mat-sidenav'));
        element.triggerEventHandler('openedStart', {});

        expect(onOpenSpy).toHaveBeenCalled();
    });

    it('should trigger onClosed', () => {
        const onClosedSpy = spyOn(component, 'onClosed');

        const element = fixture.debugElement.query(By.css('.mat-sidenav'));
        element.triggerEventHandler('closedStart', {});

        expect(onClosedSpy).toHaveBeenCalled();
    });

    it('should toggle .sidenav-open on body', () => {
        component.onOpen();

        expect(document.body.classList.contains('sidenav-open')).toBe(true);

        component.onClosed();

        expect(document.body.classList.contains('sidenav-open')).toBe(false);
    });
});
