import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobotPluginComponent } from './cobot-plugin.component';

describe('CobotPluginComponent', () => {
  let component: CobotPluginComponent;
  let fixture: ComponentFixture<CobotPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CobotPluginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CobotPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
