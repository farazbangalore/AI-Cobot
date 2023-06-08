import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitSummaryComponent } from './git-summary.component';

describe('GitSummaryComponent', () => {
  let component: GitSummaryComponent;
  let fixture: ComponentFixture<GitSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GitSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GitSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
