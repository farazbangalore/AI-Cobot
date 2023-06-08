import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeExplainComponent } from './code-explain.component';

describe('CodeExplainComponent', () => {
  let component: CodeExplainComponent;
  let fixture: ComponentFixture<CodeExplainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeExplainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeExplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
