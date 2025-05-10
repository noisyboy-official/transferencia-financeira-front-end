import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaComponent } from './transferencia.component';

describe('TransferenciaComponent', () => {
  let component: TransferenciaComponent;
  let fixture: ComponentFixture<TransferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error alerts when validation fails', () => {
    component.erroContaOrigem = true;
    component.erroContaDestino = true;
    component.erroValor = true;
    fixture.detectChanges();

    const alertContaOrigem = fixture.nativeElement.querySelector('.alert-danger:contains("A conta de origem deve ter 10 dígitos.")');
    const alertContaDestino = fixture.nativeElement.querySelector('.alert-danger:contains("A conta de destino deve ter 10 dígitos.")');
    const alertValor = fixture.nativeElement.querySelector('.alert-danger:contains("O valor da transferência deve ser válido e maior que zero.")');

    expect(alertContaOrigem).toBeTruthy();
    expect(alertContaDestino).toBeTruthy();
    expect(alertValor).toBeTruthy();
  });
});
