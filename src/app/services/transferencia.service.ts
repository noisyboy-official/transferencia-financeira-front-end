import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {
  private apiUrl = 'http://localhost:8080/transferencia';

  constructor(private http: HttpClient) {}

  private formatarData(data: string): string {
    return new Date(data).toISOString().split('T')[0];
  }

  private transferir(data: { contaOrigem: number; contaDestino: string | number; dataTransferencia: string; valor: string | number }): Observable<any> {
    data.dataTransferencia = this.formatarData(data.dataTransferencia);
    return this.http.post(`${this.apiUrl}/transferir`, data, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      }
    });
  }

  private validarContas(contaOrigem: number, contaDestino: string | number): void {
    if (!contaOrigem || !contaDestino) {
      throw new Error('Conta de origem e destino são obrigatórias.');
    }
    if (!Number.isInteger(contaOrigem) || (typeof contaDestino === 'number' && !Number.isInteger(contaDestino))) {
      throw new Error('Conta de origem e destino devem ser valores numéricos inteiros.');
    }
  }

  agendarTransferencia(data: { contaOrigem: number; contaDestino: string; dataTransferencia: string; valor: string }): Observable<any> {
    this.validarContas(data.contaOrigem, data.contaDestino);
    return this.transferir(data);
  }

  realizarTransferencia(data: { contaOrigem: number; contaDestino: number; valor: number; dataTransferencia: string }): Observable<any> {
    this.validarContas(data.contaOrigem, data.contaDestino);
    return this.transferir(data);
  }

  listarAgendamentos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/agendamentos`);
  }

  listarTransferencias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transferencias`);
  }

  testHttpClient(): void {
    console.log('HttpClient injetado:', !!this.http);
  }
}
