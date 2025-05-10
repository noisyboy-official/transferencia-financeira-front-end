import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferenciaService } from '../services/transferencia.service';
import { FormsModule } from '@angular/forms';

declare const bootstrap: any;

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TransferenciaComponent implements OnInit {
  historicoTransferencias: any[] = [];
  historicoTransferenciasAgendadas: any[] = [];
  dataAgendamento: string = '';
  dataValida: boolean = false;
  contaOrigem: string = '';
  contaDestino: string = '';
  valor: number = 0;
  erroContaOrigem: boolean = false;
  erroContaDestino: boolean = false;
  erroValor: boolean = false;
  erroDataAgendamento: boolean = false;
  private alertTimeouts: { [key: string]: any } = {};
  alerta: { mensagem: string, tipo: string } | null = null;

  constructor(private transferenciaService: TransferenciaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarHistoricoTransferencias();
  }

  fecharAlerta(alerta: 'erroContaOrigem' | 'erroContaDestino' | 'erroValor' | 'erroDataAgendamento') {
    this[alerta] = false;
    clearTimeout(this.alertTimeouts[alerta]);
    delete this.alertTimeouts[alerta];
    this.cdr.detectChanges();
  }

  realizarTransferencia(): void {
    const errosAnteriores = { ...this.alertTimeouts };
    this.erroContaOrigem = false;
    this.erroContaDestino = false;
    this.erroValor = false;

    if (!this.contaOrigem || this.contaOrigem.toString().length !== 10) {
        this.erroContaOrigem = true;
        if (!errosAnteriores['erroContaOrigem']) {
            this.alertTimeouts['erroContaOrigem'] = setTimeout(() => this.fecharAlerta('erroContaOrigem'), 10000);
            return;
        }
    }

    if (!this.contaDestino || this.contaDestino.toString().length !== 10) {
        this.erroContaDestino = true;
        if (!errosAnteriores['erroContaDestino']) {
            this.alertTimeouts['erroContaDestino'] = setTimeout(() => this.fecharAlerta('erroContaDestino'), 10000);
            return;
        }
    }

    if (!this.valor || this.valor <= 0) {
        this.erroValor = true;
        if (!errosAnteriores['erroValor']) {
            this.alertTimeouts['erroValor'] = setTimeout(() => this.fecharAlerta('erroValor'), 10000);
            return;
        }
    }
    
    const transferenciaData = {
        contaOrigem: +this.contaOrigem,
        contaDestino: +this.contaDestino,
        valor: this.valor,
        dataTransferencia: new Date().toISOString()
    };

    this.transferenciaService.realizarTransferencia(transferenciaData).subscribe(
        (response: any) => {
            console.log('Transferência realizada com sucesso:', response);
            this.carregarHistoricoTransferencias();
            this.mostrarAlerta('Transferência realizada com sucesso!', 'success');
        },
        (error: any) => {
            console.error('Erro ao realizar transferência:', error);
            this.mostrarAlerta('Erro ao realizar transferência. Tente novamente.', 'danger');
        }
    );
  }

  carregarHistoricoTransferencias(): void {
    this.transferenciaService.listarTransferencias().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.historicoTransferencias = response;
          console.log('Histórico de transferências atualizado:', this.historicoTransferencias);
          this.cdr.detectChanges();
        } else {
          console.error('Formato inesperado da resposta:', response);
          this.historicoTransferencias = [];
        }
      },
      (error: any) => {
        console.error('Erro ao carregar histórico de transferências:', error);
      }
    );
  }

  abrirModalAgendamento(): void {
    const modal = new bootstrap.Modal(document.getElementById('modalAgendamento'));
    modal.show();
  }

  validarData(): void {
    this.dataValida = !!this.dataAgendamento && new Date(this.dataAgendamento) > new Date();
  }

  confirmarAgendamento(): void {
    const dias = Math.ceil((new Date(this.dataAgendamento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    if (dias < 0 || dias > 50) {
        this.exibirAlerta('A data de agendamento deve estar dentro do intervalo permitido de 0 a 50 dias.', 'erroDataAgendamento');
        return;
    }

    const transferenciaData = {
        contaOrigem: +this.contaOrigem,
        contaDestino: this.contaDestino.toString(),
        valor: this.valor.toFixed(2),
        dataTransferencia: this.dataAgendamento
    };

    this.transferenciaService.agendarTransferencia(transferenciaData).subscribe(
        response => {
            console.log('Transferência agendada com sucesso:', response);
            this.carregarHistoricoTransferenciasAgendadas();
            this.mostrarAlerta('Agendamento realizado com sucesso!', 'success');
            const modalElement = document.getElementById('modalAgendamento');
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance?.hide();
            }
        },
        error => {
            console.error('Erro ao agendar transferência:', error);
            this.mostrarAlerta('Erro ao realizar agendamento. Tente novamente.', 'danger');
        }
    );
  }

  private exibirAlerta(mensagem: string, alerta: 'erroContaOrigem' | 'erroContaDestino' | 'erroValor' | 'erroDataAgendamento'): void {
    this[alerta] = true;
    this.alertTimeouts[alerta] = setTimeout(() => this.fecharAlerta(alerta), 10000);
    this.cdr.detectChanges();
  }

  carregarHistoricoTransferenciasAgendadas(): void {
    this.transferenciaService.listarAgendamentos().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.historicoTransferenciasAgendadas = response;
          console.log('Histórico de transferências agendadas atualizado:', this.historicoTransferenciasAgendadas);
        } else {
          console.error('Formato inesperado da resposta:', response);
          this.historicoTransferenciasAgendadas = [];
        }
      },
      (error: any) => {
        console.error('Erro ao carregar histórico de transferências agendadas:', error);
      }
    );
  }

  mostrarAlerta(mensagem: string, tipo: string) {
    this.alerta = { mensagem, tipo };
    setTimeout(() => this.alerta = null, 5000);
  }
}
