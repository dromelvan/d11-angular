import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarSidenavComponent } from './toolbar-sidenav.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ToolbarSidenavComponent', () => {
    let component: ToolbarSidenavComponent;
    let fixture: ComponentFixture<ToolbarSidenavComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            providers: [SidenavComponent],
        });

        fixture = TestBed.createComponent(ToolbarSidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the toolbar-sidenav', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle the sidenav', () => {
        // <any> and component['sidenav'] lets us spy on the private sidenav property
        const toggleSpy = spyOn<any>(component['sidenav'], 'toggle');

        component.toggleSidenav();

        expect(toggleSpy).toHaveBeenCalled();
    });

    it('should trigger onWindowScroll', () => {
        // <any> lets us spy on private methods
        const onWindowScrollSpy = spyOn(component, <any>'onWindowScroll');

        window.dispatchEvent(new Event('scroll'));

        expect(onWindowScrollSpy).toHaveBeenCalled();
    });
});
