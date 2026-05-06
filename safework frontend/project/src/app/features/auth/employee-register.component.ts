import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, EmployeeRegistrationRequest } from '../../core/services/auth.service';

@Component({
  selector: 'app-employee-register',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  template: `
    <div class="register-page">

      <!-- Background decorations -->
      <div class="bg-orb bg-orb-1"></div>
      <div class="bg-orb bg-orb-2"></div>
      <div class="bg-orb bg-orb-3"></div>
      <svg class="bg-grid" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="rg" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(26,60,94,0.045)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rg)" />
      </svg>

      <div class="register-wrap">

        <!-- Top bar -->
        <div class="topbar">
          <a routerLink="/login" class="back-link">
            <span class="back-arrow">←</span>
            <span>Back to Login</span>
          </a>
          <div class="topbar-brand">
            <div class="brand-logo">
              <span>SW</span>
              <div class="logo-shine"></div>
            </div>
            <span class="brand-name">SafeWork</span>
          </div>
        </div>

        <div class="card">
          <!-- Card top accent -->

          <!-- Card header -->
          <div class="card-header">
            <div class="header-left">
              <div class="header-icon">👤</div>
              <div>
                <h2>Employee Registration</h2>
                <p>Complete the form below to request system access.</p>
              </div>
            </div>
            <div class="step-indicator">
              <div class="step-dot active"></div>
              <div class="step-line"></div>
              <div class="step-dot"></div>
            </div>
          </div>

          <!-- Alerts -->
          <div *ngIf="success()" class="alert alert-success">
            <span>{{ success() }}</span>
          </div>
          <div *ngIf="error()" class="alert alert-danger">
            <span class="alert-icon">⚠</span>
            <span>{{ error() }}</span>
          </div>

          <form (ngSubmit)="submit()" class="content-grid">

            <!-- ── SECTION 1: Personal Info ── -->
            <section class="form-section">
              <div class="section-header">
                <div class="section-num">01</div>
                <div>
                  <h3>Personal Information</h3>
                  <span class="section-sub">Your basic identity details</span>
                </div>
              </div>

              <div class="field-group">
                <label class="form-label">
                  <span class=""></span>Full Name
                </label>
                <div class="input-wrap">
                  <input class="form-control has-prefix" [(ngModel)]="form.userName" name="userName" required placeholder="John Doe" />
                  <div class="focus-bar"></div>
                </div>
              </div>

              <div class="field-row">
                <div class="field-group">
                  <label class="form-label">
                    <span class=""></span>Date of Birth
                  </label>
                  <div class="input-wrap">
                    <input type="date" class="form-control has-prefix" [(ngModel)]="form.employeeDOB" name="employeeDOB" required />
                    <div class="focus-bar"></div>
                  </div>
                </div>
                <div class="field-group">
                  <label class="form-label">
                    <span class=""></span>Gender
                  </label>
                  <div class="input-wrap">
                    <span class="input-prefix-icon">⚧</span>
                    <select class="form-control has-prefix" [(ngModel)]="form.employeeGender" name="employeeGender" required>
                      <option value="" disabled>Select...</option>
                      <option *ngFor="let g of genders" [value]="g">{{ g }}</option>
                    </select>
                    <div class="focus-bar"></div>
                  </div>
                </div>
              </div>

              <div class="field-group">
                <label class="form-label">
                  <span class=""></span>Email Address
                </label>
                <div class="input-wrap">
                  <span class="input-prefix-icon">✉</span>
                  <input type="email" class="form-control has-prefix" [(ngModel)]="form.userEmail" name="userEmail" required placeholder="john@company.com" />
                  <div class="focus-bar"></div>
                </div>
              </div>

              <div class="field-group">
                <label class="form-label">
                  <span class=""></span>Contact Phone
                </label>
                <div class="input-wrap">
                  <span class="input-prefix-icon">📞</span>
                  <input class="form-control has-prefix" [(ngModel)]="form.userContact" name="userContact" required placeholder="+91 00000 00000" />
                  <div class="focus-bar"></div>
                </div>
              </div>

              <div class="field-group">
                <label class="form-label">
                  <span class=""></span>Password
                </label>
                <div class="input-wrap">
                  <input type="password" class="form-control has-prefix" [(ngModel)]="form.password" name="password" required minlength="6" placeholder="Min. 6 characters" />
                  <div class="focus-bar"></div>
                </div>
              </div>

              <div class="field-group">
                <label class="form-label">
                  <span class=""></span>Home Address
                </label>
                <div class="input-wrap">
                  <textarea class="form-control" [(ngModel)]="form.employeeAddress" name="employeeAddress" rows="3" required placeholder="Street, City, State, PIN"></textarea>
                  <div class="focus-bar"></div>
                </div>
              </div>
            </section>

            <!-- ── SECTION 2: Work Info ── -->
            <section class="form-section">
              <div class="section-header">
                <div class="section-num">02</div>
                <div>
                  <h3>Work Information</h3>
                  <span class="section-sub">Your role &amp; documents</span>
                </div>
              </div>

              <div class="field-group">
                <label class="form-label">
                  <span class=""></span>Department
                </label>
                <div class="input-wrap">
                  <select class="form-control has-prefix" [(ngModel)]="form.employeeDepartmentName" name="employeeDepartmentName" required>
                    <option value="" disabled>Select Department...</option>
                    <option *ngFor="let dept of departments" [value]="dept">{{ dept }}</option>
                  </select>
                  <div class="focus-bar"></div>
                </div>
              </div>

              <div class="field-group">
                <label class="form-label">
                  <span class=""></span>Document Type
                </label>
                <div class="input-wrap">
                  <select class="form-control has-prefix" [(ngModel)]="form.employeeDocumentType" name="employeeDocumentType" required>
                    <option value="" disabled>Select document type...</option>
                    <option value="ID_PROOF">ID Proof</option>
                    <option value="TRAINING_CERTIFICATE">Training Certificate</option>
                  </select>
                  <div class="focus-bar"></div>
                </div>
              </div>

              <!-- File upload zone -->
              <div class="field-group">
                <label class="form-label">
                  <span class=""></span>Document Upload
                </label>
                <div class="upload-zone" [class.has-file]="selectedFile">
                  <input type="file" class="upload-input" (change)="onFileSelected($event)" required />
                  <div class="upload-content">
                    <div class="upload-icon">{{ selectedFile ? '✅' : '' }}</div>
                    <div class="upload-text">
                      <strong>{{ selectedFile ? selectedFile.name : 'Click or drag file here' }}</strong>
                      <span>{{ selectedFile ? 'File selected — ready to upload' : 'PDF, JPG, PNG up to 10MB' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dept cards -->
              <div class="dept-grid">
                <div class="dept-card" *ngFor="let dept of departments" [class.selected]="form.employeeDepartmentName === dept" (click)="form.employeeDepartmentName = dept">
                  <span class="dept-dot"></span>
                  <span>{{ dept }}</span>
                </div>
              </div>

              <!-- Pending note -->
              <div class="pending-note">
                <div>
                  <strong>Initial Status: Pending Approval</strong><br />
                  <span style="color:red">You can login only after admin activates your account.</span>
                </div>
              </div>
            </section>

            <!-- Actions -->
            <div class="actions">
              <button type="button" class="btn btn-outline" (click)="router.navigate(['/login'])">
                <span>✕</span> Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="loading()">
                <span class="btn-spinner" *ngIf="loading()"></span>
                <span>{{ loading() ? 'Submitting...' : 'Submit Registration' }}</span>
                <span *ngIf="!loading()">→</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── Keyframes ─────────────────────────────────────────── */
    @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideL   { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
    @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes floatA   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
    @keyframes floatB   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(16px)} }
    @keyframes popIn    { 0%{opacity:0;transform:scale(.55) rotate(-10deg)} 70%{transform:scale(1.1) rotate(2deg)} 100%{opacity:1;transform:scale(1) rotate(0)} }
    @keyframes logoShine{ 0%{left:-60%;opacity:0} 40%{opacity:1} 100%{left:130%;opacity:0} }
    @keyframes alertIn  { from{opacity:0;transform:translateY(-8px) scaleY(.9)} to{opacity:1;transform:translateY(0) scaleY(1)} }
    @keyframes spinBtn  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
    @keyframes linePulse{ 0%,100%{opacity:.4} 50%{opacity:1} }
    @keyframes sectionIn{ from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

    /* ── Page ─────────────────────────────────────────────── */
    .register-page {
      min-height: 100vh;
      background: linear-gradient(160deg, #eef4fb 0%, #f0f4f8 55%, #e8f0f8 100%);
      padding: 24px;
      position: relative;
      overflow: hidden;
    }

    /* BG decorations */
    .bg-grid { position:fixed; inset:0; pointer-events:none; z-index:0; }
    .bg-orb  { position:fixed; border-radius:50%; pointer-events:none; z-index:0; }
    .bg-orb-1 { width:500px; height:500px; background:radial-gradient(circle,rgba(56,139,253,.1) 0%,transparent 65%); top:-140px; right:-120px; animation:floatA 9s ease-in-out infinite; }
    .bg-orb-2 { width:350px; height:350px; background:radial-gradient(circle,rgba(93,200,184,.08) 0%,transparent 65%); bottom:80px; left:-80px; animation:floatB 11s ease-in-out infinite; }
    .bg-orb-3 { width:200px; height:200px; background:radial-gradient(circle,rgba(255,180,60,.07) 0%,transparent 65%); top:50%; left:40%; animation:floatA 7s 1s ease-in-out infinite; }

    /* ── Wrap ─────────────────────────────────────────────── */
    .register-wrap { max-width: 1020px; margin: 0 auto; position: relative; z-index: 1; }

    /* ── Top bar ──────────────────────────────────────────── */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      animation: fadeUp .5s both;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: #1a3c5e;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      background: rgba(26,60,94,.07);
      border: 1px solid rgba(26,60,94,.12);
      padding: 7px 14px;
      border-radius: 99px;
      transition: background .2s, transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
    }
    .back-link:hover { background:rgba(26,60,94,.13); transform:translateX(-3px); box-shadow:0 4px 14px rgba(26,60,94,.12); }
    .back-arrow { font-size: 15px; transition: transform .25s ease; }
    .back-link:hover .back-arrow { transform: translateX(-3px); }

    .topbar-brand { display:flex; align-items:center; gap:10px; }
    .brand-logo {
      width:38px; height:38px;
      background:linear-gradient(135deg,#1a3c5e,#2563a8);
      color:#fff; border-radius:10px;
      display:flex; align-items:center; justify-content:center;
      font-size:12px; font-weight:800;
      box-shadow:0 4px 12px rgba(26,60,94,.25);
      position:relative; overflow:hidden;
      animation:popIn .7s .1s both;
      transition:transform .3s cubic-bezier(.34,1.56,.64,1);
    }
    .brand-logo:hover { transform:rotate(8deg) scale(1.12); }
    .logo-shine { position:absolute; top:-10px; left:-60px; width:35px; height:130%; background:rgba(255,255,255,.35); transform:skewX(-20deg); animation:logoShine 3.5s 1.5s ease-in-out infinite; }
    .brand-name { font-size:17px; font-weight:700; color:#1a3c5e; letter-spacing:-.01em; }

    /* ── Card ─────────────────────────────────────────────── */
    .card {
      background: #fff;
      border-radius: 22px;
      box-shadow: 0 0 0 1px rgba(26,60,94,.07), 0 8px 32px rgba(26,60,94,.09), 0 32px 72px rgba(26,60,94,.05);
      overflow: hidden;
      animation: fadeUp .65s .1s cubic-bezier(.22,.68,0,1.2) both;
      transition: box-shadow .3s ease;
    }
    .card:hover { box-shadow: 0 0 0 1px rgba(26,60,94,.1), 0 12px 44px rgba(26,60,94,.12), 0 40px 90px rgba(26,60,94,.07); }

    .card-accent-bar {
      height: 4px;
      background: linear-gradient(90deg, #1a3c5e, #388bfd, #5de0e6, #388bfd, #1a3c5e);
      background-size: 300% 100%;
      animation: shimmer 3s linear infinite;
    }

    /* ── Card header ──────────────────────────────────────── */
    .card-header {
      padding: 22px 28px;
      border-bottom: 1px solid #edf0f5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: fadeUp .6s .2s both;
    }
    .header-left { display:flex; align-items:center; gap:14px; }
    .header-icon {
      width: 46px; height: 46px;
      background: linear-gradient(135deg, #e8f0fe, #d0e8ff);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      box-shadow: 0 2px 10px rgba(56,139,253,.15);
      animation: popIn .7s .3s both;
      flex-shrink: 0;
    }
    .card-header h2 { margin:0; font-size:21px; font-weight:800; color:#0d2035; letter-spacing:-.02em; }
    .card-header p  { margin:4px 0 0; color:#64748b; font-size:13px; }

    /* Step indicator */
    .step-indicator { display:flex; align-items:center; gap:8px; }
    .step-dot {
      width:10px; height:10px;
      border-radius:50%;
      background:#e2e8f0;
      transition:background .3s,transform .3s;
    }
    .step-dot.active { background:linear-gradient(135deg,#388bfd,#5de0e6); transform:scale(1.3); }
    .step-line { width:28px; height:2px; background:#e2e8f0; border-radius:99px; }

    /* ── Alerts ───────────────────────────────────────────── */
    .alert {
      margin: 14px 28px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 11px;
      padding: 11px 16px;
      font-size: 13.5px;
      font-weight: 500;
      animation: alertIn .35s cubic-bezier(.22,.68,0,1.2) both;
    }
    .alert-success { background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; }
    .alert-danger  { background:#fff5f5; border:1px solid #fcd4d4; color:#c0392b; }
    .alert-icon { font-size:16px; }

    /* ── Grid ─────────────────────────────────────────────── */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      padding: 0;
    }

    /* ── Sections ─────────────────────────────────────────── */
    .form-section {
      padding: 26px 28px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      animation: sectionIn .65s both;
    }
    .form-section:first-of-type { border-right: 1px solid #edf0f5; animation-delay:.25s; }
    .form-section:last-of-type  { animation-delay:.35s; }

    .section-header { display:flex; align-items:flex-start; gap:14px; margin-bottom:4px; }
    .section-num {
      font-size: 28px;
      font-weight: 900;
      color: transparent;
      -webkit-text-stroke: 2px rgba(56,139,253,.25);
      line-height: 1;
      flex-shrink: 0;
      letter-spacing: -.04em;
    }
    .form-section h3 { margin:0; font-size:16px; font-weight:800; color:#0d2035; letter-spacing:-.01em; }
    .section-sub { font-size:12px; color:#94a3b8; margin-top:2px; display:block; }

    /* ── Fields ───────────────────────────────────────────── */
    .field-group { display:flex; flex-direction:column; gap:5px; }
    .field-row   { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

    .form-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: .06em;
      transition: color .2s;
    }
    .label-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: linear-gradient(135deg, #388bfd, #5de0e6);
      flex-shrink: 0;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1);
    }
    .field-group:focus-within .form-label { color: #1a3c5e; }
    .field-group:focus-within .label-dot  { transform: scale(1.5); }

    .input-wrap { position:relative; }
    .input-prefix-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      pointer-events: none;
      z-index: 1;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1);
    }
    .field-group:focus-within .input-prefix-icon { transform:translateY(-50%) scale(1.2); }

    .focus-bar {
      position: absolute;
      bottom: 0; left: 50%;
      width: 0; height: 2px;
      background: linear-gradient(90deg, #388bfd, #5de0e6);
      border-radius: 0 0 6px 6px;
      transition: width .3s ease, left .3s ease;
    }
    .field-group:focus-within .focus-bar { width:100%; left:0; }

    .form-control {
      width: 100%;
      box-sizing: border-box;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 9px 12px;
      font-size: 13.5px;
      color: #0d2035;
      transition: border-color .25s, box-shadow .25s, background .2s, transform .2s;
      outline: none;
      font-family: inherit;
    }
    .form-control.has-prefix { padding-left: 36px; }
    .form-control::placeholder { color:#94a3b8; }
    .form-control:hover:not(:focus) { border-color:#b0c4de; background:#f1f5f9; }
    .form-control:focus { border-color:#388bfd; background:#fff; box-shadow:0 0 0 4px rgba(56,139,253,.1); transform:translateY(-1px); }

    textarea.form-control { resize:vertical; min-height:76px; }
    select.form-control { appearance:none; cursor:pointer; }

    /* ── File upload zone ─────────────────────────────────── */
    .upload-zone {
      position: relative;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 18px 16px;
      background: #f8fafc;
      cursor: pointer;
      transition: border-color .25s, background .25s, transform .2s ease;
      overflow: hidden;
    }
    .upload-zone:hover { border-color:#388bfd; background:#f0f7ff; transform:translateY(-2px); }
    .upload-zone.has-file { border-color:#22c55e; background:#f0fdf4; border-style:solid; }
    .upload-input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
    .upload-content { display:flex; align-items:center; gap:14px; pointer-events:none; }
    .upload-icon { font-size:26px; }
    .upload-text { display:flex; flex-direction:column; gap:2px; }
    .upload-text strong { font-size:13px; color:#0d2035; font-weight:700; word-break:break-all; }
    .upload-text span { font-size:11.5px; color:#94a3b8; }

    /* ── Dept quick-select grid ───────────────────────────── */
    .dept-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .dept-card {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 11px;
      border-radius: 99px;
      border: 1.5px solid #e2e8f0;
      background: #f8fafc;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: border-color .2s, background .2s, color .2s, transform .25s cubic-bezier(.34,1.56,.64,1);
    }
    .dept-card:hover { border-color:#388bfd; background:#f0f7ff; color:#1a3c5e; transform:translateY(-2px); }
    .dept-card.selected { border-color:#388bfd; background:linear-gradient(135deg,#e8f4ff,#dbeeff); color:#1a3c5e; font-weight:700; transform:translateY(-2px); box-shadow:0 4px 12px rgba(56,139,253,.15); }
    
    /* ── Pending note ─────────────────────────────────────── */
    .pending-note {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 13px 16px;
      border: 1.5px dashed #cbd5e1;
      border-radius: 11px;
      background: #fafbfc;
      font-size: 12.5px;
      color: #64748b;
      transition: border-color .2s, background .2s;
    }
    .pending-note:hover { border-color:#388bfd; background:#f0f7ff; }
    .pending-icon { font-size:20px; flex-shrink:0; }
    .pending-note strong { color:#1a3c5e; display:block; margin-bottom:3px; font-size:13px; }

    /* ── Security badges ──────────────────────────────────── */
    .security-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .sec-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: 99px;
      background: #f0f4f8;
      border: 1px solid #e2e8f0;
      font-size: 11.5px;
      font-weight: 600;
      color: #475569;
    }

    /* ── Actions ──────────────────────────────────────────── */
    .actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid #edf0f5;
      padding: 18px 28px;
      background: #fafbfc;
      animation: fadeUp .6s .5s both;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 22px;
      border-radius: 11px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .2s, filter .2s, background .2s;
    }

    .btn-outline {
      background: #fff;
      border: 1.5px solid #cbd5e1;
      color: #475569;
    }
    .btn-outline:hover { background:#f1f5f9; border-color:#94a3b8; transform:translateY(-2px); box-shadow:0 4px 14px rgba(0,0,0,.06); }
    .btn-outline:active { transform:scale(.98); }

    .btn-primary {
      background: linear-gradient(135deg, #1a3c5e 0%, #2563a8 100%);
      color: #fff;
      position: relative;
      overflow: hidden;
      min-width: 180px;
      justify-content: center;
    }
    .btn-primary:hover:not([disabled]) { transform:translateY(-2px) scale(1.015); box-shadow:0 10px 28px rgba(26,60,94,.3); filter:brightness(1.08); }
    .btn-primary:active:not([disabled]) { transform:scale(.98); transition-duration:.08s; }
    .btn-primary[disabled] { opacity:.7; cursor:not-allowed; }
    .btn-spinner { width:15px; height:15px; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spinBtn .7s linear infinite; flex-shrink:0; }

    /* ── Responsive ───────────────────────────────────────── */
    @media (max-width: 820px) {
      .content-grid { grid-template-columns: 1fr; }
      .form-section:first-of-type { border-right: none; border-bottom: 1px solid #edf0f5; }
      .field-row { grid-template-columns: 1fr; }
      .step-indicator { display: none; }
    }
  `],
})
export class EmployeeRegisterComponent {
  private auth = inject(AuthService);
  readonly router = inject(Router);

  loading = signal(false);
  error = signal('');
  success = signal('');
  selectedFile: File | null = null;

  genders = ['Male', 'Female', 'Other'];
  departments = ['Manufacturing', 'Safety', 'Operations', 'Compliance', 'Maintenance', 'Warehouse', 'Quality'];

  form: EmployeeRegistrationRequest = {
    userName: '',
    userEmail: '',
    userContact: '',
    password: '',
    employeeDOB: '',
    employeeGender: '',
    employeeAddress: '',
    employeeDepartmentName: '',
    employeeDocumentType: '',
    employeeFileURL: '',
  };

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async submit(): Promise<void> {
    this.error.set('');
    this.success.set('');

    if (!this.selectedFile) {
      this.error.set('Please select a document to upload.');
      return;
    }

    this.loading.set(true);

    const formData = new FormData();
    // Wrap JSON in a Blob with application/json type for Spring @RequestPart
    formData.append('employee', new Blob([JSON.stringify(this.form)], { type: 'application/json' }));
    formData.append('file', this.selectedFile);

    const result = await this.auth.registerEmployee(formData);
    this.loading.set(false);

    if (!result.success) {
      this.error.set(result.message);
      return;
    }

    this.success.set(result.message);
    setTimeout(() => this.router.navigate(['/login']), 1200);
  }
}

// import { Component, inject, signal } from '@angular/core';
// import { NgFor, NgIf } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { AuthService, EmployeeRegistrationRequest } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-employee-register',
//   standalone: true,
//   imports: [NgIf, NgFor, FormsModule, RouterLink],
//   template: `
//     <div class="register-page">
//       <div class="register-wrap">
//         <a routerLink="/login" class="back-link">← Back to Login</a>

//         <div class="card">
//           <div class="card-header">
//             <h2>Employee Registration</h2>
//             <p>Complete the form below to request system access.</p>
//           </div>

//           <div *ngIf="success()" class="alert alert-success">{{ success() }}</div>
//           <div *ngIf="error()" class="alert alert-danger">{{ error() }}</div>

//           <form (ngSubmit)="submit()" class="content-grid">
//             <section>
//               <h3>Personal Information</h3>
//               <label>Full Name</label>
//               <input class="form-control" [(ngModel)]="form.userName" name="userName" required />
//               <label>DOB</label>
//               <input type="date" class="form-control" [(ngModel)]="form.employeeDOB" name="employeeDOB" required />
//               <label>Gender</label>
//               <select class="form-control" [(ngModel)]="form.employeeGender" name="employeeGender" required>
//                 <option value="" disabled>Select...</option>
//                 <option *ngFor="let g of genders" [value]="g">{{ g }}</option>
//               </select>
//               <label>Email Address</label>
//               <input type="email" class="form-control" [(ngModel)]="form.userEmail" name="userEmail" required />
//               <label>Contact Phone</label>
//               <input class="form-control" [(ngModel)]="form.userContact" name="userContact" required />
//               <label>Password</label>
//               <input type="password" class="form-control" [(ngModel)]="form.password" name="password" required minlength="6" />
//               <label>Home Address</label>
//               <textarea class="form-control" [(ngModel)]="form.employeeAddress" name="employeeAddress" rows="3" required></textarea>
//             </section>

//             <section>
//               <h3>Work Information</h3>
//               <label>Department</label>
//               <select class="form-control" [(ngModel)]="form.employeeDepartmentName" name="employeeDepartmentName" required>
//                 <option value="" disabled>Select Department...</option>
//                 <option *ngFor="let dept of departments" [value]="dept">{{ dept }}</option>
//               </select>
//               <label>Document Type</label>
//               <select class="form-control" [(ngModel)]="form.employeeDocumentType" name="employeeDocumentType" required>
//                 <option value="" disabled>Select document type...</option>
//                 <option value="ID_PROOF">ID Proof</option>
//                 <option value="TRAINING_CERTIFICATE">Training Certificate</option>
//               </select>
//               <label>Document Upload</label>
//               <input type="file" class="form-control" (change)="onFileSelected($event)" required />
//               <div class="pending-note">
//                 Initial Status: <strong>Pending Approval</strong><br />
//                 You can login only after admin activates your account.
//               </div>
//             </section>

//             <div class="actions">
//               <button type="button" class="btn btn-outline" (click)="router.navigate(['/login'])">Cancel</button>
//               <button type="submit" class="btn btn-primary" [disabled]="loading()">{{ loading() ? 'Submitting...' : 'Submit Registration' }}</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .register-page { min-height: 100vh; background: var(--bg); padding: 24px; }
//     .register-wrap { max-width: 980px; margin: 0 auto; }
//     .back-link { color: var(--text-muted); text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 12px; }
//     .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
//     .card-header { padding: 18px; border-bottom: 1px solid var(--border); }
//     .card-header h2 { margin: 0; font-size: 22px; }
//     .card-header p { margin: 6px 0 0; color: var(--text-muted); font-size: 13px; }
//     .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 18px; }
//     section h3 { margin: 0 0 12px; font-size: 18px; }
//     label { display: block; margin: 10px 0 6px; font-size: 12px; color: var(--text-muted); }
//     .pending-note { margin-top: 14px; padding: 10px; border: 1px dashed var(--border); border-radius: 8px; font-size: 12px; color: var(--text-muted); background: #fafafa; }
//     .actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border); padding-top: 14px; }
//     .alert { margin: 12px 18px 0; }
//     @media (max-width: 820px) { .content-grid { grid-template-columns: 1fr; } }
//   `],
// })
// export class EmployeeRegisterComponent {
//   private auth = inject(AuthService);
//   readonly router = inject(Router);

//   loading = signal(false);
//   error = signal('');
//   success = signal('');
//   selectedFile: File | null = null;

//   genders = ['Male', 'Female', 'Other'];
//   departments = ['Manufacturing', 'Safety', 'Operations', 'Compliance', 'Maintenance', 'Warehouse', 'Quality'];

//   form: EmployeeRegistrationRequest = {
//     userName: '',
//     userEmail: '',
//     userContact: '',
//     password: '',
//     employeeDOB: '',
//     employeeGender: '',
//     employeeAddress: '',
//     employeeDepartmentName: '',
//     employeeDocumentType: '',
//     employeeFileURL: '',
//   };

//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.selectedFile = file;
//     }
//   }

//   async submit(): Promise<void> {
//     this.error.set('');
//     this.success.set('');
    
//     if (!this.selectedFile) {
//       this.error.set('Please select a document to upload.');
//       return;
//     }

//     this.loading.set(true);

//     const formData = new FormData();
//     // Wrap JSON in a Blob with application/json type for Spring @RequestPart
//     formData.append('employee', new Blob([JSON.stringify(this.form)], { type: 'application/json' }));
//     formData.append('file', this.selectedFile);

//     const result = await this.auth.registerEmployee(formData);
//     this.loading.set(false);

//     if (!result.success) {
//       this.error.set(result.message);
//       return;
//     }

//     this.success.set(result.message);
//     setTimeout(() => this.router.navigate(['/login']), 1200);
//   }
// }
