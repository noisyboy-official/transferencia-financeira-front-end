import { Routes } from '@angular/router';
import { TransferenciaComponent } from './transferencia/transferencia.component';

export const routes: Routes = [
  { path: 'transferencia', component: TransferenciaComponent },
  { path: '**', redirectTo: 'transferencia' } // rota coringa, redireciona para "transferencia"
];
