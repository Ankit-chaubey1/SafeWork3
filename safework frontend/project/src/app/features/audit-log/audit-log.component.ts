import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <div class="page-title">Audit Log</div>
          <div class="page-subtitle">Immutable record of all system actions</div>
        </div>
        <div style="display:flex;gap:12px">
          <button class="btn btn-outline" (click)="exportToCSV()">Export CSV</button>
          <button class="btn btn-danger" (click)="clearLogs()">Clear Log</button>
        </div>
      </div>

      <div class="alert alert-info" style="margin-bottom:20px">
        <span>ℹ</span> The audit log provides a tamper-proof trail of all user actions across the system. Records are immutable and cannot be modified.
      </div>

      <div class="card">
          <div class="search-bar" style="margin:0;flex:1;flex-wrap:wrap;gap:12px">
            <div class="search-input-wrap" style="flex:1;min-width:200px">
              <span class="search-icon">🔍</span>
              <input class="form-control" [ngModel]="search()" (ngModelChange)="search.set($event)" placeholder="Search by user or action..." />
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <span class="text-sm text-muted">From:</span>
              <input type="date" class="form-control" style="width:140px" [ngModel]="dateFrom()" (ngModelChange)="dateFrom.set($event)" />
              <span class="text-sm text-muted">To:</span>
              <input type="date" class="form-control" style="width:140px" [ngModel]="dateTo()" (ngModelChange)="dateTo.set($event)" />
            </div>
            <select class="form-control" style="width:140px" [ngModel]="filterAction()" (ngModelChange)="filterAction.set($event)">
              <option value="">All Actions</option>
              <option>CREATE</option><option>UPDATE</option><option>DELETE</option><option>LOGIN</option>
            </select>
          </div>
          <span class="text-muted text-sm">{{ filtered().length }} entries</span>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr><th>Action</th><th>Resource</th><th>User</th><th>Timestamp</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of filtered()">
                <td><span [class]="actionBadge(log.action)">{{ log.action }}</span></td>
                <td style="max-width:320px" class="text-sm">{{ log.resource }}</td>
                <td class="text-sm">{{ log.userName }}</td>
                <td class="text-sm text-muted">{{ log.timestamp | date:'MMM d, y HH:mm:ss' }}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" (click)="viewDetails(log)">View</button>
                </td>
              </tr>
              <tr *ngIf="filtered().length === 0">
                <td colspan="5"><div class="empty-state"><p>No log entries found</p></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div class="modal-backdrop" *ngIf="selectedLog" (click)="selectedLog = null">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Log Details</h3>
          <button class="btn btn-ghost btn-sm" (click)="selectedLog = null">✕</button>
        </div>
        <div class="modal-body" *ngIf="selectedLog">
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Audit ID</span><span>#{{ selectedLog.auditId }}</span></div>
            <div class="detail-item"><span class="detail-label">Timestamp</span><span>{{ selectedLog.timestamp | date:'MMMM d, y HH:mm:ss' }}</span></div>
            <div class="detail-item"><span class="detail-label">Action</span><span [class]="actionBadge(selectedLog.action)">{{ selectedLog.action }}</span></div>
            <div class="detail-item"><span class="detail-label">User</span><span>{{ selectedLog.userName }} (ID: {{ selectedLog.userId }})</span></div>
          </div>
          <div style="margin-top:20px">
            <span class="detail-label">Resource / Description</span>
            <div class="card" style="margin-top:8px;padding:12px;background:var(--bg-light)">
              {{ selectedLog.resource }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="selectedLog = null">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .detail-item { display: flex; flex-direction: column; gap: 4px; }
    .detail-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); }
  `],
})
export class AuditLogComponent {
  private data = inject(MockDataService);
  search = signal('');
  filterAction = signal('');
  dateFrom = signal('');
  dateTo = signal('');
  selectedLog: any = null;

  filtered = computed(() => {
    let list = [...this.data.auditLogs()].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const q = this.search().toLowerCase();
    const action = this.filterAction();
    const fromDate = this.dateFrom();
    const toDate = this.dateTo();
    
    if (q) {
      list = list.filter(l => 
        l.userName.toLowerCase().includes(q) || 
        l.resource.toLowerCase().includes(q) || 
        l.action.toLowerCase().includes(q)
      );
    }
    
    if (action) {
      list = list.filter(l => l.action === action);
    }

    if (fromDate) {
      const from = new Date(fromDate).getTime();
      list = list.filter(l => new Date(l.timestamp).getTime() >= from);
    }

    if (toDate) {
      const to = new Date(toDate).setHours(23, 59, 59, 999);
      list = list.filter(l => new Date(l.timestamp).getTime() <= to);
    }

    return list;
  });

  actionBadge(a: string): string {
    const map: Record<string, string> = { CREATE: 'badge badge-success', UPDATE: 'badge badge-info', DELETE: 'badge badge-danger', LOGIN: 'badge badge-neutral' };
    return map[a] ?? 'badge badge-neutral';
  }

  viewDetails(log: any) {
    this.selectedLog = log;
  }

  clearLogs() {
    if (confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      this.data.auditLogs.set([]);
    }
  }

  exportToCSV() {
    const data = this.filtered();
    if (data.length === 0) return;

    const headers = ['Action', 'Resource', 'User', 'Timestamp'];
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = [
        row.action,
        `"${row.resource.replace(/"/g, '""')}"`,
        row.userName,
        row.timestamp
      ];
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
