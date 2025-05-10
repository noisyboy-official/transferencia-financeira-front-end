import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { TransferenciaComponent } from './transferencia/transferencia.component';
import { TransferenciaService } from './services/transferencia.service';

const routes: Routes = [
  { path: 'agendar', component: TransferenciaComponent },
  { path: '**', redirectTo: 'agendar' }
];

@NgModule({
  declarations: [AppComponent, TransferenciaComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule.forRoot(routes), CommonModule],
  providers: [TransferenciaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
